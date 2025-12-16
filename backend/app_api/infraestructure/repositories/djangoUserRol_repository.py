from app_api.application.repositories.UserRol_repository import UserRolRepository
from app_api.domain.entities.UserRol_entity import UserRolEntity

from app_api.models import Rol, User, UserRol
from django.utils import timezone

class DjangoUserRolRepository(UserRolRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: UserRol)-> UserRolEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return UserRolEntity(
                id=instance.id,
                user=instance.user.id,
                rol=instance.rol.id,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: UserRolEntity)-> UserRolEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                if UserRol.objects.filter(user=obj.user, rol=obj.rol, deleted_at=None).exists():
                    raise Exception("El userrol ya existe")
                instance = UserRol()
                instance.created_at = timezone.now()
            else:
                instance = UserRol.objects.get(id=obj.id, deleted_at=None)
            instance.user = User.objects.get(id=obj.user, deleted_at=None)
            instance.rol = Rol.objects.get(id=obj.rol, deleted_at=None)
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[UserRolEntity]| UserRolEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in UserRol.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> UserRolEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(UserRol.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return UserRol.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[UserRolEntity]:
        try:
            return [self._map_to_entity(instance) for instance in UserRol.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = UserRol.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

