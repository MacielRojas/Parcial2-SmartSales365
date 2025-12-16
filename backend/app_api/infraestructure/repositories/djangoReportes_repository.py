from django.apps import apps
from django.db.models import Q
from django.db import connection
from app_api.application.repositories.Reportes_repository import (ReporteSqlRepository,
    ReportesRepository)

class DjangoReporteRepository(ReportesRepository):
    def get(self, tabla, fecha_inicio, fecha_fin, atributos, filtros)->list:
        if not tabla:
            raise Exception('tabla es obligatoria')
        try:
            Model = apps.get_model('app_api', tabla)
            queryset = Model.objects.filter(deleted_at=None)

            # Procesar filtros
            if filtros:
                q_obj = self._build_q(filtros)
                queryset = queryset.filter(q_obj)

            # Rango de fechas
            if fecha_inicio and fecha_fin:
                queryset = queryset.filter(fecha__range=[fecha_inicio, fecha_fin])

            # Selección de atributos
            if atributos:
                queryset = queryset.values(*atributos)
            else:
                queryset = queryset.values()
            return list(queryset)
        except Exception as e:
            raise Exception(f'No se pudo obtener el reporte: {e}')
        
    def _build_q(self, filtros):
        """
        Construye un objeto Q a partir de filtros que pueden ser:
        - dict simple
        - lista de dicts (AND)
        - dict con clave 'OR'
        ejemplo de dict:
        {
            "campo1": "valor1",
            "campo2": "valor2"
        }
        ejemplo de dict con OR:
        {
            "OR": [
                {
                    "campo1": "valor1",
                    "campo2": "valor2"
                },
                {
                    "campo3": "valor3",
                    "campo4": "valor4"
                }
            ]
        }
        """
        if isinstance(filtros, dict):
            if "OR" in filtros:
                q_obj = Q()
                for f in filtros["OR"]:
                    q_obj |= self._build_q(f)
                return q_obj
            else:
                # dict normal {campo: valor}
                return Q(**filtros)

        elif isinstance(filtros, list):
            q_obj = Q()
            for f in filtros:
                q_obj &= self._build_q(f)  # AND por defecto
            return q_obj

        else:
            raise ValueError("Formato de filtros no soportado")
        
class DjangoReporteSqlRepository(ReporteSqlRepository):
    def get(self, stringsql:str, params: dict | None = None)->list:
        if not stringsql:
            raise Exception('stringsql es requerido')

        sql_lower = stringsql.strip().lower()
        
        if not sql_lower.startswith('select') or sql_lower.__contains__('drop') or sql_lower.__contains__('set') or sql_lower.__contains__('alter'):
            raise Exception('No se puede ejecutar esta consulta')
        
        try:
            with connection.cursor() as cursor:
                if params:
                    cursor.execute(stringsql, params)
                else:
                    cursor.execute(stringsql)
                    
                if not cursor.description:
                    raise Exception('Cursor vacio')
                column_names = [col[0] for col in cursor.description]
                results = [dict(zip(column_names, row)) for row in cursor.fetchall()]
                
                for row in results:
                    if "password" in row:
                        del row["password"]
                
                return results
        except Exception as e:
            raise Exception(f'No se pudo obtener el reporte: {e}')
