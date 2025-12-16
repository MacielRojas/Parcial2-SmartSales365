from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from app_api.application.usecases.reports.reporte_usecase import ReporteSqlUseCase
from app_api.infraestructure.repositories.djangoReportes_repository import (
    DjangoReporteSqlRepository)
from app_api.infraestructure.services.generador_doc.django_doc import DjangoDocService

class ReporteSqlView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if not request.data:
            return Response({"error": "No se recibieron datos"}, status=status.HTTP_400_BAD_REQUEST)
        reporteuc = ReporteSqlUseCase(reporte_repository=DjangoReporteSqlRepository(),)
        data = request.data
        if (isinstance(data, list)):
            created = []
            failed = []
            try:
                for idx, item in enumerate(data):
                    obj = reporteuc.execute(
                        stringsql=item.get("stringsql"),
                        params=item.get("params"),
                    )
                    if obj:
                        created.append({'index': idx, 'obj': obj})
                    else:
                        failed.append({'index': idx, 'error': 'No se pudo crear el registro'})
                if created and not failed:
                    return Response({'created': created}, status=status.HTTP_201_CREATED)
                elif created and failed:
                    multi_status = getattr(status, 'HTTP_207_MULTI_STATUS', status.HTTP_200_OK)
                    return Response({'created': created, 'failed': failed}, status=multi_status)
                else:
                    return Response({'failed': failed}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        obj = reporteuc.execute(
            stringsql=data.get("stringsql"),
            params=data.get("params"),
        )
        if obj:
            return Response({'obj': obj}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No se pudo crear el registro'}, status=status.HTTP_400_BAD_REQUEST)
