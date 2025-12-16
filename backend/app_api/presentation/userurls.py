from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from app_api.presentation.views.User_view import UserView
from app_api.presentation.views.Rol_view import RolView
from app_api.presentation.views.UserRol_view import UserRolView
from app_api.presentation.views.Permiso_view import PermisoView
from app_api.presentation.views.Register_view import RegisterView


urlpatterns = [
    path('usuarios/', UserView.as_view(), name='user'),
    path('usuarios/<int:id>', UserView.as_view(), name='user'),

    path('register/', RegisterView.as_view(), name='register'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('roles/', RolView.as_view(), name='user'),
    path('roles/<int:id>', RolView.as_view(), name='user'),

    path('userroles/', UserRolView.as_view(), name='user'),
    path('userroles/<int:id>', UserRolView.as_view(), name='user'),

    path('permisos/', PermisoView.as_view(), name='user'),
    path('permisos/<int:id>', PermisoView.as_view(), name='user'),

    path('permisosroles/', UserRolView.as_view(), name='user'),
    path('permisosroles/<int:id>', UserRolView.as_view(), name='user'),
]