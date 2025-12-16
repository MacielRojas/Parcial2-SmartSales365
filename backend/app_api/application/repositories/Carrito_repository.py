from abc import ABC, abstractmethod
from app_api.domain.entities.Carrito_entity import CarritoEntity

class CarritoRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: CarritoEntity)-> CarritoEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> CarritoEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[CarritoEntity] | CarritoEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[CarritoEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

