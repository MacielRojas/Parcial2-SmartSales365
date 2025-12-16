from app_api.application.repositories.Descuento_repository import DescuentoRepository
from app_api.domain.entities.Descuento_entity import DescuentoEntity

from app_api.models import Descuento, Producto
from django.utils import timezone

class DjangoDescuentoRepository(DescuentoRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: Descuento)-> DescuentoEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return DescuentoEntity(
                id=instance.id,
                tipo=instance.tipo,
                producto=instance.producto.id,
                valor=instance.valor,
                fecha_inicio=instance.fecha_inicio,
                fecha_fin=instance.fecha_fin,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: DescuentoEntity)-> DescuentoEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = Descuento()
                instance.created_at = timezone.now()
            else:
                instance = Descuento.objects.get(id=obj.id, deleted_at=None)
            instance.tipo = obj.tipo
            instance.producto = Producto.objects.get(id=obj.producto, deleted_at=None)
            instance.valor = obj.valor
            instance.fecha_inicio = obj.fecha_inicio
            instance.fecha_fin = obj.fecha_fin
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[DescuentoEntity]| DescuentoEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in Descuento.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> DescuentoEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(Descuento.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return Descuento.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[DescuentoEntity]:
        try:
            return [self._map_to_entity(instance) for instance in Descuento.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = Descuento.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

