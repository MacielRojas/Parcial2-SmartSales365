from app_api.application.repositories.Carrito_repository import CarritoRepository
from app_api.domain.entities.Carrito_entity import CarritoEntity

from app_api.models import Carrito, User
from django.utils import timezone

class DjangoCarritoRepository(CarritoRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: Carrito)-> CarritoEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return CarritoEntity(
                id=instance.id,
                usuario=instance.usuario.id,
                total=instance.total,
                descuento=instance.descuento,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: CarritoEntity)-> CarritoEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = Carrito()
                instance.created_at = timezone.now()
            else:
                instance = Carrito.objects.get(id=obj.id, deleted_at=None)
            instance.usuario = User.objects.get(id=obj.usuario, deleted_at=None)
            instance.total = obj.total
            instance.descuento = obj.descuento
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[CarritoEntity]| CarritoEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in Carrito.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> CarritoEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(Carrito.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return Carrito.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[CarritoEntity]:
        try:
            return [self._map_to_entity(instance) for instance in Carrito.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = Carrito.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

