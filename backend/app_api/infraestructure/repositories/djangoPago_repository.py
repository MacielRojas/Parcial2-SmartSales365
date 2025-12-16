from app_api.application.repositories.Pago_repository import PagoRepository
from app_api.domain.entities.Pago_entity import PagoEntity

from app_api.models import Carrito, Pago
from django.utils import timezone

class DjangoPagoRepository(PagoRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: Pago)-> PagoEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return PagoEntity(
                id=instance.id,
                monto=instance.monto,
                moneda=instance.moneda,
                estado=instance.estado,
                carrito=instance.carrito.id,
                payment_method_id=instance.payment_method_id,
                payment_intent=instance.payment_intent,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: PagoEntity)-> PagoEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = Pago()
                instance.created_at = timezone.now()
            else:
                instance = Pago.objects.get(id=obj.id, deleted_at=None)
            instance.monto = obj.monto
            instance.moneda = obj.moneda
            instance.estado = obj.estado
            instance.carrito = Carrito.objects.get(id=obj.carrito, deleted_at=None)
            instance.payment_method_id = obj.payment_method_id
            instance.payment_intent = obj.payment_intent
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[PagoEntity]| PagoEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in Pago.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> PagoEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(Pago.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return Pago.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[PagoEntity]:
        try:
            return [self._map_to_entity(instance) for instance in Pago.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = Pago.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

