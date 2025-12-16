from django.urls import path
from app_api.presentation.userurls import urlpatterns
from app_api.presentation.views.Carrito_view import CarritoView
from app_api.presentation.views.DetalleCarrito_view import DetalleCarritoView
from app_api.presentation.views.Pago_view import PagoView
from app_api.presentation.views.Descuento_view import DescuentoView
from app_api.presentation.views.Producto_view import ProductoView
from app_api.presentation.views.Categoria_view import CategoriaView
from app_api.presentation.views.Venta_view import VentaView
from app_api.presentation.views.Mantenimiento_view import MantenimientoView
from app_api.presentation.views.Garantia_view import GarantiaView
from app_api.presentation.views.Factura_view import FacturaView
from app_api.presentation.views.Galeria_view import GaleriaView

urlpatterns = [
    path('carritos/', CarritoView.as_view(), name='carrito'),
    path('carritos/<int:id>', CarritoView.as_view(), name='carrito'),

    path('detallescarrito/', DetalleCarritoView.as_view(), name='detallecarrito'),
    path('detallescarrito/<int:id>', DetalleCarritoView.as_view(), name='detallecarrito'),

    path('pagos/', PagoView.as_view(), name='pago'),
    path('pagos/<int:id>', PagoView.as_view(), name='pago'),

    # path('ventas/', VentaView.as_view(), name='pago'),
    # path('ventas/<int:id>', VentaView.as_view(), name='pago'),

    path('decuentos/', DescuentoView.as_view(), name='descuento'),
    path('decuentos/<int:id>', DescuentoView.as_view(), name='descuento'),

    path('productos/', ProductoView.as_view(), name='producto'),
    path('productos/<int:id>', ProductoView.as_view(), name='producto'),

    path('categorias/', CategoriaView.as_view(), name='categoria'),
    path('categorias/<int:id>', CategoriaView.as_view(), name='categoria'),

    path('ventas/', VentaView.as_view(), name='venta'),
    path('ventas/<int:id>', VentaView.as_view(), name='venta'),

    path('mantenimientos/', MantenimientoView.as_view(), name='mantenimiento'),
    path('mantenimientos/<int:id>', MantenimientoView.as_view(), name='mantenimiento'),

    path('garantias/', GarantiaView.as_view(), name='garantia'),
    path('garantias/<int:id>', GarantiaView.as_view(), name='garantia'),

    path('facturas/', FacturaView.as_view(), name='factura'),
    path('facturas/<int:id>', FacturaView.as_view(), name='factura'),

    path('galerias/', GaleriaView.as_view(), name='galeria'),
    path('galerias/<int:id>', GaleriaView.as_view(), name='galeria'),
]