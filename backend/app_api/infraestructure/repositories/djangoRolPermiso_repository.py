from app_api.application.repositories.RolPermiso_repository import RolPermisoRepository
from app_api.domain.entities.RolPermiso_entity import RolPermisoEntity

from app_api.models import Permiso, Rol, RolPermiso
from django.utils import timezone

class DjangoRolPermisoRepository(RolPermisoRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: RolPermiso)-> RolPermisoEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return RolPermisoEntity(
                id=instance.id,
                rol=instance.rol.id,
                permiso=instance.permiso.id,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: RolPermisoEntity)-> RolPermisoEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = RolPermiso()
                instance.created_at = timezone.now()
            else:
                instance = RolPermiso.objects.get(id=obj.id, deleted_at=None)
            instance.rol = Rol.objects.get(id=obj.rol, deleted_at=None)
            instance.permiso = Permiso.objects.get(id=obj.permiso, deleted_at=None)
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[RolPermisoEntity]| RolPermisoEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in RolPermiso.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> RolPermisoEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(RolPermiso.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return RolPermiso.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[RolPermisoEntity]:
        try:
            return [self._map_to_entity(instance) for instance in RolPermiso.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = RolPermiso.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

