from abc import ABC, abstractmethod
from app_api.domain.entities.RolPermiso_entity import RolPermisoEntity

class RolPermisoRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: RolPermisoEntity)-> RolPermisoEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> RolPermisoEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[RolPermisoEntity] | RolPermisoEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[RolPermisoEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

