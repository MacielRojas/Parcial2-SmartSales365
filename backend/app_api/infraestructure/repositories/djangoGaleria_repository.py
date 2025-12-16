from app_api.application.repositories.Galeria_repository import GaleriaRepository
from app_api.domain.entities.Galeria_entity import GaleriaEntity
from app_api.models import Galeria, Producto
from django.utils import timezone
import requests

class DjangoGaleriaRepository(GaleriaRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: Galeria)-> GaleriaEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return GaleriaEntity(
                id=instance.id,
                producto=instance.producto.id,
                imagen=instance.imagen,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: GaleriaEntity)-> GaleriaEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = Galeria()
                instance.created_at = timezone.now()
            else:
                instance = Galeria.objects.get(id=obj.id, deleted_at=None)
            instance.producto = Producto.objects.get(id=obj.producto, deleted_at=None)
            instance.imagen = obj.imagen
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[GaleriaEntity]| GaleriaEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in Galeria.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> GaleriaEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(Galeria.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return Galeria.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[GaleriaEntity]:
        try:
            return [self._map_to_entity(instance) for instance in Galeria.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = Galeria.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

