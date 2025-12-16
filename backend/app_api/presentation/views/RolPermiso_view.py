from app_api.application.usecases.RolPermiso_usecase import RolPermisoUseCase
from app_api.infraestructure.repositories.djangoRolPermiso_repository import DjangoRolPermisoRepository
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

class RolPermisoView(APIView):
    permission_classes = [IsAuthenticated]
    def __init__(self):
        pass

    def get(self, request, id=None):
        obj_crud = RolPermisoUseCase(repository=DjangoRolPermisoRepository())
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
        obj_crud = RolPermisoUseCase(repository=DjangoRolPermisoRepository())
        data = request.data
        if isinstance(data, list):
            created = []
            failed = []
            for idx, item in enumerate(data):
                try:
                    obj = obj_crud.create(rol=item.get("rol"),permiso=item.get("permiso"))
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
            obj = obj_crud.create(rol=data.get('rol'), permiso=data.get('permiso'))
            return Response({'obj': obj.__dict__}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        if not request.data:
             return Response({"error": "No se recibieron datos"}, status=status.HTTP_400_BAD_REQUEST)
        obj_crud = RolPermisoUseCase(repository=DjangoRolPermisoRepository())
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
        obj_crud = RolPermisoUseCase(repository=DjangoRolPermisoRepository())
        try:
            if not id:
                id = request.query_params.get('id')
            obj = obj_crud.delete(id=id)
            if obj:
                return Response({'success': obj}, status=status.HTTP_200_OK)
            return Response({'success': obj}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

