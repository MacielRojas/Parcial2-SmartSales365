from app_api.application.repositories.Producto_repository import ProductoRepository
from app_api.domain.entities.Producto_entity import ProductoEntity

from app_api.models import Categoria, Producto
from django.utils import timezone

class DjangoProductoRepository(ProductoRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: Producto)-> ProductoEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return ProductoEntity(
                id=instance.id,
                nombre=instance.nombre,
                precio=instance.precio,
                stock=instance.stock,
                codigo=instance.codigo,
                marca=instance.marca,
                categoria=instance.categoria.id,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: ProductoEntity)-> ProductoEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = Producto()
                instance.created_at = timezone.now()
            else:
                instance = Producto.objects.get(id=obj.id, deleted_at=None)
            instance.nombre = obj.nombre
            instance.precio = obj.precio
            instance.stock = obj.stock
            instance.codigo = obj.codigo
            instance.marca = obj.marca
            instance.categoria = Categoria.objects.get(id=obj.categoria, deleted_at=None)
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[ProductoEntity]| ProductoEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in Producto.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> ProductoEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(Producto.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return Producto.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[ProductoEntity]:
        try:
            return [self._map_to_entity(instance) for instance in Producto.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = Producto.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

