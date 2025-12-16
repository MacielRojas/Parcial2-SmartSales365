from app_api.application.repositories.Bitacora_repository import BitacoraRepository
from app_api.domain.entities.Bitacora_entity import BitacoraEntity
from app_api.models import Bitacora, User
from django.utils import timezone

class DjangoBitacoraRepository(BitacoraRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: Bitacora)-> BitacoraEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return BitacoraEntity(
                id=instance.id,
                usuario=instance.usuario.id,
                accion=instance.accion,
                ipv4=instance.ipv4,
                nivel=instance.nivel,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: BitacoraEntity)-> BitacoraEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = Bitacora()
                instance.created_at = timezone.now()
            else:
                instance = Bitacora.objects.get(id=obj.id, deleted_at=None)
            instance.usuario = User.objects.get(id=obj.usuario, deleted_at=None)
            instance.accion = obj.accion
            instance.ipv4 = obj.ipv4
            instance.nivel = obj.nivel
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[BitacoraEntity]| BitacoraEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in Bitacora.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> BitacoraEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(Bitacora.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return Bitacora.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[BitacoraEntity]:
        try:
            return [self._map_to_entity(instance) for instance in Bitacora.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = Bitacora.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

