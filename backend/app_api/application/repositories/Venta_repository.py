from abc import ABC, abstractmethod
from app_api.domain.entities.Venta_entity import VentaEntity

class VentaRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: VentaEntity)-> VentaEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> VentaEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[VentaEntity] | VentaEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[VentaEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

