from app_api.application.usecases.Galeria_usecase import GaleriaUseCase
from app_api.infraestructure.repositories.djangoGaleria_repository import DjangoGaleriaRepository
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from app_api.infraestructure.services.image.cloudinary_service import CloudinaryService

class GaleriaView(APIView):
    permission_classes = [AllowAny]
    def __init__(self):
        pass

    def get(self, request, id=None):
        obj_crud = GaleriaUseCase(
            repository=DjangoGaleriaRepository(),
            cloud=CloudinaryService(),
            )
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
        if not request.data or not request.FILES.get('imagen'):
             return Response({"error": "No se recibieron datos"}, status=status.HTTP_400_BAD_REQUEST)
        obj_crud = GaleriaUseCase(repository=DjangoGaleriaRepository(),
            cloud=CloudinaryService(),)
        data = request.data
        file = request.FILES.get('imagen')
        # if isinstance(data, list):
        #     created = []
        #     failed = []
        #     for idx, item in enumerate(data):
        #         try:
        #             obj = obj_crud.create(producto=item.get("producto"),imagen=item.get("imagen"))
        #             if obj:
        #                 created.append({'index': idx, 'obj': obj.__dict__})
        #             else:
        #                 failed.append({'index': idx, 'error': 'No se pudo crear el registro'})
        #         except Exception as e:
        #             failed.append({'index': idx, 'error': str(e)})
        #     if created and not failed:
        #         return Response({'created': created}, status=status.HTTP_201_CREATED)
        #     elif created and failed:
        #         multi_status = getattr(status, 'HTTP_207_MULTI_STATUS', status.HTTP_200_OK)
        #         return Response({'created': created, 'failed': failed}, status=multi_status)
        #     else:
        #         return Response({'failed': failed}, status=status.HTTP_400_BAD_REQUEST)
        try:
            obj = obj_crud.create(producto=data.get('producto'), imagen=file)
            return Response({'obj': obj.__dict__}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        if not request.data:
             return Response({"error": "No se recibieron datos"}, status=status.HTTP_400_BAD_REQUEST)
        obj_crud = GaleriaUseCase(repository=DjangoGaleriaRepository(),
            cloud=CloudinaryService(),)
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
        obj_crud = GaleriaUseCase(repository=DjangoGaleriaRepository(),
            cloud=CloudinaryService(),)
        try:
            if not id:
                id = request.query_params.get('id')
            obj = obj_crud.delete(id=id)
            if obj:
                return Response({'success': obj}, status=status.HTTP_200_OK)
            return Response({'success': obj}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

