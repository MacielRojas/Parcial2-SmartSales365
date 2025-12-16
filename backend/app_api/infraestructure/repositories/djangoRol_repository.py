from app_api.application.repositories.Rol_repository import RolRepository
from app_api.domain.entities.Rol_entity import RolEntity

from app_api.models import Rol
from django.utils import timezone

class DjangoRolRepository(RolRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: Rol)-> RolEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return RolEntity(
                id=instance.id,
                nombre=instance.nombre,
                descripcion=instance.descripcion,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: RolEntity)-> RolEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = Rol()
                instance.created_at = timezone.now()
            else:
                instance = Rol.objects.get(id=obj.id, deleted_at=None)
            instance.nombre = obj.nombre
            instance.descripcion = obj.descripcion
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[RolEntity]| RolEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in Rol.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> RolEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(Rol.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")
        
    def get_by_nombre(self, nombre)-> RolEntity :
        if not nombre:
            raise Exception("El nombre es obligatorio")
        try:
            return self._map_to_entity(Rol.objects.get(nombre=nombre, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return Rol.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[RolEntity]:
        try:
            return [self._map_to_entity(instance) for instance in Rol.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = Rol.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

