from abc import ABC, abstractmethod
from app_api.domain.entities.Factura_entity import FacturaEntity

class FacturaRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: FacturaEntity)-> FacturaEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> FacturaEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[FacturaEntity] | FacturaEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[FacturaEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

