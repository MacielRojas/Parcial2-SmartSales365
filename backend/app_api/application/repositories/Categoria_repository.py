from abc import ABC, abstractmethod
from app_api.domain.entities.Categoria_entity import CategoriaEntity

class CategoriaRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: CategoriaEntity)-> CategoriaEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> CategoriaEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[CategoriaEntity] | CategoriaEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[CategoriaEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

