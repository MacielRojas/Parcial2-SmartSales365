from abc import ABC, abstractmethod
from app_api.domain.entities.Permiso_entity import PermisoEntity

class PermisoRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: PermisoEntity)-> PermisoEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> PermisoEntity :
        pass

    @abstractmethod
    def get_by_nombre(self, nombre)-> PermisoEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[PermisoEntity] | PermisoEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[PermisoEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

