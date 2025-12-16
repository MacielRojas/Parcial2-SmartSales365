import dataclasses
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from app_api.application.usecases.reports.reporte_usecase import ReporteUseCase
from app_api.infraestructure.services.generador_doc.django_doc import DjangoDocService
from app_api.infraestructure.repositories.djangoReportes_repository import DjangoReporteRepository

class ReporteView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if not request.data:
            return Response({'error': "No se recibieron datos"},status=status.HTTP_400_BAD_REQUEST)
        
        reporteuc = ReporteUseCase(
            reporte_repository = DjangoReporteRepository(),
            doc_service = DjangoDocService(),
        )
        data = request.data
        if (isinstance(data, list)):
            created = []
            failed = []

            for idx, item in enumerate(data):
                try:
                    reporte = reporteuc.generar_reporte(
                        model_name=item.get("model_name"),
                        fecha_inicio=item.get("fecha_inicio"),
                        fecha_fin=item.get("fecha_fin"),
                        atributos=item.get("atributos"),
                        filtros=item.get("filtros"),
                    )
                    if reporte:
                        created.append({'index': idx, 'obj': reporte})
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
        reporte = reporteuc.generar_reporte(
            model_name=data.get("model_name"),
            fecha_inicio=data.get("fecha_inicio"),
            fecha_fin=data.get("fecha_fin"),
            atributos=data.get("atributos"),
            filtros=data.get("filtros"),
        )
        if reporte:
            return Response({'obj': reporte}, status=status.HTTP_201_CREATED)
        return Response({'error': 'No se pudo crear el registro'}, status=status.HTTP_400_BAD_REQUEST)