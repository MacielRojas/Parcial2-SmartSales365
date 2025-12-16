from django.urls import path
from app_api.presentation.views.reportes.Reportesfile_view import ReporteFileView
from app_api.presentation.views.reportes.ReportesSql_view import ReporteSqlView
from app_api.presentation.views.reportes.Reportes_view import ReporteView

urlpatterns = [
    path('file/', ReporteFileView.as_view(), name='reportes'),
    path('sql/', ReporteSqlView.as_view(), name='reportes'),
    path('django/', ReporteView.as_view(), name='reportes'),
]