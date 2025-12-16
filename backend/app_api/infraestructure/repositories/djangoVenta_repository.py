from app_api.application.repositories.Venta_repository import VentaRepository
from app_api.domain.entities.Venta_entity import VentaEntity

from app_api.models import Carrito, Pago, Venta
from django.utils import timezone

class DjangoVentaRepository(VentaRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: Venta)-> VentaEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return VentaEntity(
                id=instance.id,
                carrito=instance.carrito.id,
                pago=instance.pago.id,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: VentaEntity)-> VentaEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = Venta()
                instance.created_at = timezone.now()
            else:
                instance = Venta.objects.get(id=obj.id, deleted_at=None)
            instance.carrito = Carrito.objects.get(id=obj.carrito, deleted_at=None)
            instance.pago = Pago.objects.get(id=obj.pago, deleted_at=None)
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[VentaEntity]| VentaEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in Venta.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> VentaEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(Venta.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return Venta.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[VentaEntity]:
        try:
            return [self._map_to_entity(instance) for instance in Venta.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = Venta.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

