from app_api.application.repositories.Factura_repository import FacturaRepository
from app_api.domain.entities.Factura_entity import FacturaEntity

from app_api.models import Factura, Venta
from django.utils import timezone

class DjangoFacturaRepository(FacturaRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: Factura)-> FacturaEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return FacturaEntity(
                id=instance.id,
                venta=instance.venta.id,
                fecha_expendida=instance.fecha_expendida,
                nit=instance.nit,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: FacturaEntity)-> FacturaEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = Factura()
                instance.created_at = timezone.now()
            else:
                instance = Factura.objects.get(id=obj.id, deleted_at=None)
            instance.venta = Venta.objects.get(id=obj.venta, deleted_at=None)
            instance.fecha_expendida = obj.fecha_expendida
            instance.nit = obj.nit
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[FacturaEntity]| FacturaEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in Factura.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> FacturaEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(Factura.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return Factura.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[FacturaEntity]:
        try:
            return [self._map_to_entity(instance) for instance in Factura.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = Factura.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

