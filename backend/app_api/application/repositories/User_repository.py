from abc import ABC, abstractmethod
from app_api.domain.entities.User_entity import UserEntity

class UserRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: UserEntity)-> UserEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> UserEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[UserEntity] | UserEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[UserEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

