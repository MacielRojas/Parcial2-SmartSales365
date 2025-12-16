from typing import Optional
from app_api.application.services.doc_service import DocService
import io
from app_api.application.repositories.Reportes_repository import (ReporteSqlRepository,
    ReportesRepository)

class ReporteUseCase():
    ''' Crea reportes personalizados '''
    def __init__(self, reporte_repository: ReportesRepository, doc_service: DocService ):
        self.reporte_repository = reporte_repository
        self.doc_service = doc_service

    def generar_reporte(self, model_name, fecha_inicio, fecha_fin, atributos, filtros,) -> list:
        ''' Obtiene reportes personalizados '''
        if not all([
            model_name,
        ]):
            raise ValueError("model_name es requerido")
        try:
            return self.reporte_repository.get(
                tabla=model_name,
                fecha_inicio=fecha_inicio, 
                fecha_fin=fecha_fin, 
                atributos=atributos, 
                filtros=filtros,
            )
        except Exception as e:
            raise Exception(f"No se pudo obtener el reporte: {e}")

    def generar_reporte_pdf(self, reporte, nombre_doc) -> io.BytesIO:
        ''' Genera un reporte en PDF '''
        if not all([
            reporte,
        ]):
            raise ValueError("model_name es requerido")
        try:
            if reporte:
                return self.doc_service.generar_pdf(reporte, nombre_doc)
            raise Exception("No se pudo generar el reporte pdf")
        except Exception as e:
            raise Exception(f"No se pudo generar el reporte pdf: {e}")
        

    def generar_reporte_excel(self, reporte, nombre_doc) -> io.BytesIO:
        ''' Genera un reporte en Excel '''
        if not all([
            reporte
        ]):
            raise ValueError("model_name es requerido")
        try:
            if reporte:
                return self.doc_service.generar_excel(reporte, nombre_doc)
            raise Exception("No se pudo generar el reporte excel")
        except Exception as e:
            raise Exception(f"No se pudo generar el reporte excel: {e}")
        

    def generar_reporte_csv(self, reporte, nombre_doc) -> io.StringIO:
        ''' Genera un reporte en CSV '''
        if not all([
            reporte
        ]):
            raise ValueError("model_name es requerido")
        try:
            if reporte:
                return self.doc_service.generar_csv(reporte, nombre_doc)
            raise Exception("No se pudo generar el reporte csv")
        except Exception as e:
            raise Exception(f"No se pudo generar el reporte csv: {e}")
        
class ReporteSqlUseCase():
    def __init__(self, reporte_repository: ReporteSqlRepository,):
        self.reporte_repository = reporte_repository
      
    def execute(self, stringsql, params):
        if not stringsql:
            raise ValueError("stringsql es requerido")
        try:
            return self.reporte_repository.get(stringsql, params)
        except Exception as e:
            raise Exception(f"No se pudo obtener el reporte: {e}")
        