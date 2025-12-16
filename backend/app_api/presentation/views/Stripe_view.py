from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app_api.infraestructure.services.pago.stripe_service import StripeService
from rest_framework.permissions import AllowAny
from app_api.application.usecases.Pago_usecase import PagoUseCase
from app_api.infraestructure.repositories.djangoPago_repository import DjangoPagoRepository
from app_api.application.usecases.Venta_usecase import VentaUseCase
from app_api.infraestructure.repositories.djangoVenta_repository import DjangoVentaRepository
from app_api.application.usecases.Carrito_usecase import CarritoUseCase
from app_api.infraestructure.repositories.djangoCarrito_repository import DjangoCarritoRepository
from app_api.infraestructure.repositories.djangoDetalleCarrito_repository import (
    DjangoDetalleCarritoRepository)
from app_api.application.usecases.DetalleCarrito_usecase import DetalleCarritoUseCase
from app_api.infraestructure.repositories.djangoProducto_repository import DjangoProductoRepository
from app_api.application.usecases.Producto_usecase import ProductoUseCase

class StripeWebhookView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        payload = request.body
        sigheader = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        try:
            stripe = StripeService()
            pago_uc = PagoUseCase(repository=DjangoPagoRepository())
            venta_uc = VentaUseCase(repository=DjangoVentaRepository())
            
            data = stripe.handle_webhook(payload, sigheader)
            if data['id']:
                pago = pago_uc.create(
                    monto=data['amount'],
                    moneda=data['currency'],
                    estado=data['status'],
                    carrito=data['metadata']['carrito_id'],
                    payment_method_id=data['payment_method'],
                    payment_intent=data['id'],
                )
                if not pago or not pago.id:
                    raise Exception("No se pudo crear el pago")
                venta = venta_uc.create(
                    carrito=data['metadata']['carrito_id'],
                    pago=pago.id
                )
                if not venta or not venta.id:
                    raise Exception("No se pudo crear la venta")
                return Response({'pago': pago.__dict__, 'venta': venta.__dict__, 'data': data}, status=status.HTTP_200_OK)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': e.__dict__}, status=status.HTTP_400_BAD_REQUEST)

class StripeCreatePaymentIntentView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            data = {}
            for key, value in request.data.items():
                if key not in ['amount', 'payment_method_id', 'currency', 'items']:
                    data[key] = value

            carrito = create_cart(request.data.get('items'), request.data.get('user_id'), request.data.get('amount'))
            if not carrito or not carrito.id:
                raise Exception("No se pudo crear el carrito")
            
            data['carrito_id'] = carrito.id

            # crea el pago stripe
            stripe = StripeService()
            data = stripe.crear_pago(
                amount=request.data.get('amount'),
                payment_method_id=request.data.get('payment_method_id'),
                currency=request.data.get('currency'),
                **data,
            )

            # creo el pago con estado pendiente
            pago_uc = PagoUseCase(repository=DjangoPagoRepository())
            pago = pago_uc.create(
                monto=data['amount'],
                moneda=data['currency'],
                estado='pendiente',
                carrito=carrito.id,
                payment_method_id=data['payment_method'],
                payment_intent=data['id'],
            )
            if not pago or not pago.id:
                raise Exception("No se pudo crear el pago")
            print(data)
            return Response({'pago': pago.__dict__, 'data': data, 'carrito': carrito.__dict__}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class StripeCancelPaymentIntentView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            stripe = StripeService()
            data = stripe.cancelar_pago(id=request.data.get('payment_intent_id'))
            
            pago_uc = PagoUseCase(repository=DjangoPagoRepository())
            pago = pago_uc.get(payment_intent=data['payment_intent_id'])
            if not pago or not isinstance(pago, list):
                raise Exception("No se pudo crear el pago")
            pago = pago_uc.update(id=pago[0].id, estado='rechazado')

            # Actualizar el carrito
            update_cart(pago.carrito, False)
            pago = pago.__dict__
            return Response({'pago':pago, 'data': data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)  
        
class StripeConfirmPaymentIntentView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            # confirma el pago stripe
            stripe = StripeService()
            data = stripe.confirmar_pago(id=request.data.get('payment_intent_id'))
            
            # actualizar la cantidad de los productos 
            carrito = update_cart(carrito_id=data['metadata']['carrito_id'], confirm=True)
            if not carrito or not carrito.id:
                raise Exception("No se pudo crear el carrito")

            # obtener el pago
            pago_uc = PagoUseCase(repository=DjangoPagoRepository())
            pago = pago_uc.get(payment_intent=data['id'])

            if not pago or not isinstance(pago, list):
                raise Exception("No se pudo crear el pago")
            
            # actualizar el pago con estado aprobado
            pago = pago_uc.update(id=pago[0].id, estado='aprobado')
            if not pago or not pago.id:
                raise Exception("No se pudo crear el pago")
            
            # creo la venta
            venta_uc = VentaUseCase(repository=DjangoVentaRepository())
            venta = venta_uc.create(
                carrito=carrito.id,
                pago=pago.id
            )
            if not venta or not venta.id:
                raise Exception("No se pudo crear la venta")

            return Response({'pago':pago.__dict__, 'data': data, 'venta': venta.__dict__, "carrito": carrito.__dict__,}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# LOGICA
def create_cart(items, usuario_id, amount, descuento=None):
    try:
        carrito_uc = CarritoUseCase(repository=DjangoCarritoRepository())
        carrito = carrito_uc.create(
            usuario=usuario_id,
            total=amount,
            descuento=None
        )
        if not carrito or not carrito.id:
            raise Exception("No se pudo crear el carrito")
        
        detallecarrito_uc = DetalleCarritoUseCase(repository=DjangoDetalleCarritoRepository())
        detalle = []
        for item in items:
            detalle.append(detallecarrito_uc.create(
                carrito=carrito.id,
                producto=item['producto'],
                cantidad=item['cantidad'],
                descuento=item['descuento']).__dict__)
            # update_quantity(item['producto'], item['cantidad'])
        if not detalle:
            raise Exception("No se pudo crear el detalle carrito")
        return carrito
    except Exception as e:
        raise Exception(f"No se pudo crear el carrito: {e}")

def update_quantity(producto_id, cantidad, add=True):
    try:
        producto_uc = ProductoUseCase(repository=DjangoProductoRepository())
        producto = producto_uc.get(id=producto_id)
        if not producto or not isinstance(producto, list):
            raise Exception("No se pudo crear el producto")
        
        if not add:
            producto[0].stock -= cantidad
        else:
            producto[0].stock += cantidad
        producto_uc.update(id=producto[0].id, stock=producto[0].stock)
    except Exception as e:
        raise Exception(f"No se pudo actualizar el producto: {e}")

def update_cart(carrito_id:int, confirm:bool=True):
    try:
        # obtener el carrito
        carrito_uc = CarritoUseCase(repository=DjangoCarritoRepository())
        carrito = carrito_uc.get(id=carrito_id)
        if not carrito or not isinstance(carrito, list):
            raise Exception("No se pudo crear el carrito")
        
        # obtener los detalles del carrito
        detalle_uc = DetalleCarritoUseCase(repository=DjangoDetalleCarritoRepository())
        detalle = detalle_uc.get(carrito=carrito_id)

        if not detalle or not isinstance(detalle, list):
            raise Exception("No se pudo crear el detalle carrito")
        
        # actualizar las cantidades
        for item in detalle:
            # obtengo los productos
            update_quantity(producto_id=item.producto, cantidad=item.cantidad, add=not confirm)
        return carrito[0]
    except Exception as e:
        raise Exception(f"No se pudo actualizar el carrito: {e}")