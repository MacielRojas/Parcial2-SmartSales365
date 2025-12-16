from django.urls import path, include

urlpatterns = [
    path('ventas/', include('app_api.presentation.ventaurls')),
    path('usuarios/', include('app_api.presentation.userurls')),
    path('stripe/', include('app_api.presentation.stripeurls')),
    path('reportes/', include('app_api.presentation.reporteurls')),
    path('especiales/', include('app_api.presentation.especialurls')),
]