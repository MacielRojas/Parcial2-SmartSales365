from app_api.application.repositories.Garantia_repository import GarantiaRepository
from app_api.domain.entities.Garantia_entity import GarantiaEntity

from app_api.models import Garantia, Producto, User
from django.utils import timezone

class DjangoGarantiaRepository(GarantiaRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: Garantia)-> GarantiaEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return GarantiaEntity(
                id=instance.id,
                producto=instance.producto.id,
                usuario=instance.usuario.id,
                precio=instance.precio,
                fecha_inicio=instance.fecha_inicio,
                fecha_fin=instance.fecha_fin,
                descripcion=instance.descripcion,
                estado=instance.estado,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: GarantiaEntity)-> GarantiaEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = Garantia()
                instance.created_at = timezone.now()
            else:
                instance = Garantia.objects.get(id=obj.id, deleted_at=None)
            instance.producto = Producto.objects.get(id=obj.producto, deleted_at=None)
            instance.usuario = User.objects.get(id=obj.usuario, deleted_at=None)
            instance.precio = obj.precio
            instance.fecha_inicio = obj.fecha_inicio
            instance.fecha_fin = obj.fecha_fin
            instance.descripcion = obj.descripcion
            instance.estado = obj.estado
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[GarantiaEntity]| GarantiaEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in Garantia.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> GarantiaEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(Garantia.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return Garantia.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[GarantiaEntity]:
        try:
            return [self._map_to_entity(instance) for instance in Garantia.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = Garantia.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

