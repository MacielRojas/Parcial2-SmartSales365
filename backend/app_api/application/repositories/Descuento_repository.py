from abc import ABC, abstractmethod
from app_api.domain.entities.Descuento_entity import DescuentoEntity

class DescuentoRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: DescuentoEntity)-> DescuentoEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> DescuentoEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[DescuentoEntity] | DescuentoEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[DescuentoEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

