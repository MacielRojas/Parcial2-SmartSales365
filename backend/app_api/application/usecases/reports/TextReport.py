from app_api.application.usecases.reports.reporte_usecase import ReporteSqlUseCase
from app_api.infraestructure.repositories.djangoReportes_repository import DjangoReporteSqlRepository
from app_api.application.services.ia_service import IAService


class TextReportUseCase:
    def __init__(self, ia_service: IAService,):
        self.ia_service = ia_service
        
    def execute(self, text: str):
        """Genera un reporte a partir de un texto de lenguaje natural"""
        try:
            reporte_uc = ReporteSqlUseCase(DjangoReporteSqlRepository())
            stringsql = self.ia_service.text_to_sql(text)
            reporte = reporte_uc.execute(stringsql, None)
            if not reporte:
                raise Exception("Error reporte")
            return reporte
        except Exception as e:
            raise Exception(f"No se pudo generar el reporte: {e}")