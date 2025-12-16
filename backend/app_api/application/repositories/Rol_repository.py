from abc import ABC, abstractmethod
from app_api.domain.entities.Rol_entity import RolEntity

class RolRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: RolEntity)-> RolEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> RolEntity :
        pass

    @abstractmethod
    def get_by_nombre(self, nombre)-> RolEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[RolEntity] | RolEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[RolEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

