from app_api.application.repositories.MLmodel_repository import MLmodelRepository
from app_api.domain.entities.MLmodel_entity import MLmodelEntity

from app_api.models import MLmodel
from django.utils import timezone

class DjangoMLmodelRepository(MLmodelRepository):
    def __init__(self):
        pass

    def _map_to_entity(self, instance: MLmodel)-> MLmodelEntity:
        if not instance:
            raise Exception("El objeto es obligatorio")
        try:
            return MLmodelEntity(
                id=instance.id,
                name=instance.name,
                version=instance.version,
                model_data=instance.model_data,
                description=instance.description,
                created_at=instance.created_at,
                updated_at=instance.updated_at,
                deleted_at=instance.deleted_at,
            )
        except Exception as e:
            raise Exception(f"No se pudo mapear el registro: {e}")

    def save(self, obj: MLmodelEntity)-> MLmodelEntity:
        if not obj:
            raise Exception("El objeto es obligatorio")
        try:
            if not obj.id:
                instance = MLmodel()
                instance.created_at = timezone.now()
            else:
                instance = MLmodel.objects.get(id=obj.id, deleted_at=None)
            instance.name = obj.name
            instance.version = obj.version
            instance.model_data = obj.model_data
            instance.description = obj.description
            instance.updated_at = timezone.now()
            instance.deleted_at = instance.deleted_at
            instance.created_at = instance.created_at
            instance.save()
            return self._map_to_entity(instance)
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")

    def get(self, **kwargs)-> list[MLmodelEntity]| MLmodelEntity:
        try:
            kwargs.pop("deleted_at", None)
            kwargs.pop("password", None)
            return [self._map_to_entity(instance) for instance in MLmodel.objects.filter(**kwargs, deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_by_id(self, id)-> MLmodelEntity :
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return self._map_to_entity(MLmodel.objects.get(id=id, deleted_at=None))
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def exists_by_id(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            return MLmodel.objects.filter(id=id, deleted_at=None).exists()
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def get_all(self)-> list[MLmodelEntity]:
        try:
            return [self._map_to_entity(instance) for instance in MLmodel.objects.filter(deleted_at=None)]
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def delete(self, id)-> bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            instance = MLmodel.objects.get(id=id, deleted_at=None)
            instance.deleted_at = timezone.now()
            instance.save()
            return True
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

