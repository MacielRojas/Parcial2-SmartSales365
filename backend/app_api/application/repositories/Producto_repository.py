from abc import ABC, abstractmethod
from app_api.domain.entities.Producto_entity import ProductoEntity

class ProductoRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: ProductoEntity)-> ProductoEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> ProductoEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[ProductoEntity] | ProductoEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[ProductoEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

