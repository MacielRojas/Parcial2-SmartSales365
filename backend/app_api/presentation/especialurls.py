from django.urls import path
from app_api.presentation.views.Nlp_view import NLPReportesView, NLPView
from app_api.presentation.views.Bitacora_view import BitacoraView
from app_api.presentation.views.Predictventa_view import PredictVentaView
from app_api.presentation.views.PredictProducto_view import ProductoPredictView

urlpatterns = [
    path('nlp/addtocart/', NLPView.as_view(), name='npl'),
    path('nlp/reportes/', NLPReportesView.as_view(), name='nplreportes'),
    path('estadisticas/predictventa/', PredictVentaView.as_view(), name='randomforest'),
    path('estadisticas/predictproducto/', ProductoPredictView.as_view(), name='randomforest'),
    path('bitacora/', BitacoraView.as_view(), name='bitacora'),
]