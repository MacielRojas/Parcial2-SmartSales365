from app_api.application.repositories.DetalleCarrito_repository import DetalleCarritoRepository
from app_api.domain.entities.DetalleCarrito_entity import DetalleCarritoEntity

from app_api.models import Carrito, DetalleCarrito, Producto
from django.utils import timezone

class DjangoDetalleCarritoRepository(DetalleCarritoRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: DetalleCarrito)-> DetalleCarritoEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return DetalleCarritoEntity(
                id=instance.id,
                carrito=instance.carrito.id,
                producto=instance.producto.id,
                cantidad=instance.cantidad,
                descuento=instance.descuento,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: DetalleCarritoEntity)-> DetalleCarritoEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = DetalleCarrito()
                instance.created_at = timezone.now()
            else:
                instance = DetalleCarrito.objects.get(id=obj.id, deleted_at=None)
            instance.carrito = Carrito.objects.get(id=obj.carrito, deleted_at=None)
            instance.producto = Producto.objects.get(id=obj.producto, deleted_at=None)
            instance.cantidad = obj.cantidad
            instance.descuento = obj.descuento
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[DetalleCarritoEntity]| DetalleCarritoEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in DetalleCarrito.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> DetalleCarritoEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(DetalleCarrito.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return DetalleCarrito.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[DetalleCarritoEntity]:
        try:
            return [self._map_to_entity(instance) for instance in DetalleCarrito.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = DetalleCarrito.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

