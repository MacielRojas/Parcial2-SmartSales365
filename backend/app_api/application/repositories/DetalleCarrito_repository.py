from abc import ABC, abstractmethod
from app_api.domain.entities.DetalleCarrito_entity import DetalleCarritoEntity

class DetalleCarritoRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: DetalleCarritoEntity)-> DetalleCarritoEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> DetalleCarritoEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[DetalleCarritoEntity] | DetalleCarritoEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[DetalleCarritoEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

