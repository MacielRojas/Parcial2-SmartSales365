from abc import ABC, abstractmethod
from app_api.domain.entities.UserRol_entity import UserRolEntity

class UserRolRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: UserRolEntity)-> UserRolEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> UserRolEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[UserRolEntity] | UserRolEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[UserRolEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

