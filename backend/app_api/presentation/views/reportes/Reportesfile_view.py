from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from app_api.application.usecases.reports.reporte_usecase import ReporteUseCase
from app_api.infraestructure.repositories.djangoReportes_repository import DjangoReporteRepository
from app_api.infraestructure.services.generador_doc.django_doc import DjangoDocService
from django.http import HttpResponse

class ReporteFileView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if not request.data:
            return Response({'error': "No se recibieron datos"}, status=status.HTTP_400_BAD_REQUEST)            
        data = request.data
        # pdf, csv, excel
        formato = data.get("formato", "pdf").lower()
        nombre_doc = data.get("nombre_doc", "reporte")
        reporte = data.get("reporte", None)
        
        if not reporte:
            return Response({'error': "No se recibieron datos"}, status=status.HTTP_400_BAD_REQUEST)
        
        reporte_uc = ReporteUseCase(
            reporte_repository = DjangoReporteRepository(),
            doc_service = DjangoDocService(),
        )

        try:
            match formato:
                case "pdf":
                    reporte = reporte_uc.generar_reporte_pdf(
                        reporte=reporte,
                        nombre_doc=nombre_doc,
                    )
                    content_type = "application/pdf"
                    extension = "pdf"
                case "csv":
                    reporte = reporte_uc.generar_reporte_csv(
                        reporte=reporte,
                        nombre_doc=nombre_doc,
                    )
                    reporte = reporte.getvalue()
                    content_type = "text/csv"
                    extension = "csv"
                case "excel":
                    reporte = reporte_uc.generar_reporte_excel(
                        reporte=reporte,
                        nombre_doc=nombre_doc,
                    )
                    content_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    extension = "xlsx"
                case _:
                    reporte = reporte_uc.generar_reporte_pdf(
                        reporte=reporte,
                        nombre_doc=nombre_doc,
                    )
                    content_type = "application/pdf"
                    extension = "pdf"

            if reporte:
                response = HttpResponse(reporte, content_type=content_type)
                response['Content-Disposition'] = f'attachment; filename={nombre_doc}.{extension}'
                return response
            else:
                return Response({'error': 'No se pudo generar el reporte'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

