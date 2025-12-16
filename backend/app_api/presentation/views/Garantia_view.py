from app_api.application.usecases.Garantia_usecase import GarantiaUseCase
from app_api.infraestructure.repositories.djangoGarantia_repository import DjangoGarantiaRepository
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from app_api.permission import EsAdmin, EsCliente

class GarantiaView(APIView):
    permission_classes = [IsAuthenticated,]
    def __init__(self):
        pass

    def get(self, request, id=None):
        obj_crud = GarantiaUseCase(repository=DjangoGarantiaRepository())
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
        obj_crud = GarantiaUseCase(repository=DjangoGarantiaRepository())
        data = request.data
        if isinstance(data, list):
            created = []
            failed = []
            for idx, item in enumerate(data):
                try:
                    obj = obj_crud.create(producto=item.get("producto"),usuario=item.get("usuario"),precio=item.get("precio"),fecha_inicio=item.get("fecha_inicio"),fecha_fin=item.get("fecha_fin"),descripcion=item.get("descripcion"),estado=item.get("estado"))
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
            obj = obj_crud.create(producto=data.get('producto'), usuario=data.get('usuario'), precio=data.get('precio'), fecha_inicio=data.get('fecha_inicio'), fecha_fin=data.get('fecha_fin'), descripcion=data.get('descripcion'), estado=data.get('estado'))
            return Response({'obj': obj.__dict__}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        if not request.data:
             return Response({"error": "No se recibieron datos"}, status=status.HTTP_400_BAD_REQUEST)
        obj_crud = GarantiaUseCase(repository=DjangoGarantiaRepository())
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
        obj_crud = GarantiaUseCase(repository=DjangoGarantiaRepository())
        try:
            if not id:
                id = request.query_params.get('id')
            obj = obj_crud.delete(id=id)
            if obj:
                return Response({'success': obj}, status=status.HTTP_200_OK)
            return Response({'success': obj}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

