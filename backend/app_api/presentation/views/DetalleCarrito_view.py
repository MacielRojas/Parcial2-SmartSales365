from app_api.application.usecases.DetalleCarrito_usecase import DetalleCarritoUseCase
from app_api.infraestructure.repositories.djangoDetalleCarrito_repository import DjangoDetalleCarritoRepository
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from app_api.permission import EsAdmin, EsCliente

class DetalleCarritoView(APIView):
    permission_classes = [IsAuthenticated,]
    def __init__(self):
        pass

    def get(self, request, id=None):
        obj_crud = DetalleCarritoUseCase(repository=DjangoDetalleCarritoRepository())
        try:
            query_params = request.query_params.dict()
            if id:
                query_params['id'] = id
            obj = obj_crud.get(**query_params)
            if isinstance(obj, list):
                data = [item.__dict__ for item in obj]
            else:
                data = obj.__dict__
            return Response({'obj': data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        if not request.data:
             return Response({"error": "No se recibieron datos"}, status=status.HTTP_400_BAD_REQUEST)
        obj_crud = DetalleCarritoUseCase(repository=DjangoDetalleCarritoRepository())
        data = request.data
        if isinstance(data, list):
            created = []
            failed = []
            for idx, item in enumerate(data):
                try:
                    obj = obj_crud.create(carrito=item.get("carrito"),producto=item.get("producto"),cantidad=item.get("cantidad"),descuento=item.get("descuento"))
                    if obj:
                        created.append({'index': idx, 'obj': obj.__dict__})
                    else:
                        failed.append({'index': idx, 'error': 'No se pudo crear el registro'})
                except Exception as e:
                    failed.append({'index': idx, 'error': str(e)})
            if created and not failed:
                return Response({'created': created}, status=status.HTTP_201_CREATED)
            elif created and failed:
                multi_status = getattr(status, 'HTTP_207_MULTI_STATUS', status.HTTP_200_OK)
                return Response({'created': created, 'failed': failed}, status=multi_status)
            else:
                return Response({'failed': failed}, status=status.HTTP_400_BAD_REQUEST)
        try:
            obj = obj_crud.create(carrito=data.get('carrito'), producto=data.get('producto'), cantidad=data.get('cantidad'), descuento=data.get('descuento'))
            return Response({'obj': obj.__dict__}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        if not request.data:
             return Response({"error": "No se recibieron datos"}, status=status.HTTP_400_BAD_REQUEST)
        obj_crud = DetalleCarritoUseCase(repository=DjangoDetalleCarritoRepository())
        data = {}
        for key, value in request.data.items():
            if key != 'id':
                data[key] = value
        try:
            obj = obj_crud.update(request.data.get('id'), **data)
            return Response({'obj': obj.__dict__}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id=None):
        obj_crud = DetalleCarritoUseCase(repository=DjangoDetalleCarritoRepository())
        try:
            if not id:
                id = request.query_params.get('id')
            obj = obj_crud.delete(id=id)
            if obj:
                return Response({'success': obj}, status=status.HTTP_200_OK)
            return Response({'success': obj}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

