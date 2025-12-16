from app_api.application.repositories.User_repository import UserRepository
from app_api.domain.entities.User_entity import UserEntity

from app_api.models import User
from django.utils import timezone

class DjangoUserRepository(UserRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: User)-> UserEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return UserEntity(
                id=instance.id,
                username=instance.username,
                password=instance.password,
                email=instance.email,
                born_date=instance.born_date,
                gender=instance.gender,
                first_name=instance.first_name,
                last_name=instance.last_name,
                is_active=instance.is_active,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: UserEntity)-> UserEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = User()
                instance.created_at = timezone.now()
            else:
                instance = User.objects.get(id=obj.id, deleted_at=None)
            instance.username = obj.username
            instance.email = obj.email
            instance.born_date = obj.born_date
            instance.gender = obj.gender
            instance.first_name = obj.first_name
            instance.last_name = obj.last_name
            instance.is_active = obj.is_active
            instance.password = obj.password
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[UserEntity]| UserEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in User.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> UserEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(User.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return User.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[UserEntity]:
        try:
            return [self._map_to_entity(instance) for instance in User.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = User.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

