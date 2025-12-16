from rest_framework.permissions import BasePermission
from app_api.models import Rol, UserRol

class EsAdmin(BasePermission):
    def has_permission(self, request, view,) -> bool:
            user = request.user
            if not user.is_authenticated:
                return False
            
            roles = UserRol.objects.filter(user=user.id, deleted_at=None)
            for userrol in roles:
                rol = Rol.objects.get(id=userrol.rol.id, deleted_at=None)
                if rol and rol.nombre == 'Administrador':
                    return True
            return False 
    
class EsCliente(BasePermission):
    def has_permission(self, request, view,) -> bool:
            user = request.user
            if not user.is_authenticated:
                return False
            
            roles = UserRol.objects.filter(user=user.id, deleted_at=None)
            for userrol in roles:
                rol = Rol.objects.get(id=userrol.rol.id, deleted_at=None)
                if rol and rol.nombre == 'Cliente':
                    return True
            return False