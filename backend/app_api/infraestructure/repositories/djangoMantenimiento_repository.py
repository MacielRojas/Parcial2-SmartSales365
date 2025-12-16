from app_api.application.repositories.Mantenimiento_repository import MantenimientoRepository
from app_api.domain.entities.Mantenimiento_entity import MantenimientoEntity

from app_api.models import Mantenimiento, Producto, User
from django.utils import timezone

class DjangoMantenimientoRepository(MantenimientoRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: Mantenimiento)-> MantenimientoEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return MantenimientoEntity(
                id=instance.id,
                producto=instance.producto.id,
                precio=instance.precio,
                fecha_programada=instance.fecha_programada,
                estado=instance.estado,
                usuario=instance.usuario.id,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: MantenimientoEntity)-> MantenimientoEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = Mantenimiento()
                instance.created_at = timezone.now()
            else:
                instance = Mantenimiento.objects.get(id=obj.id, deleted_at=None)
            instance.producto = Producto.objects.get(id=obj.producto, deleted_at=None)
            instance.precio = obj.precio
            instance.fecha_programada = obj.fecha_programada
            instance.estado = obj.estado
            instance.usuario = User.objects.get(id=obj.usuario, deleted_at=None)
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[MantenimientoEntity]| MantenimientoEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in Mantenimiento.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> MantenimientoEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(Mantenimiento.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return Mantenimiento.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[MantenimientoEntity]:
        try:
            return [self._map_to_entity(instance) for instance in Mantenimiento.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = Mantenimiento.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

