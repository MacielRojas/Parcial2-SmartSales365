from abc import ABC, abstractmethod
from app_api.domain.entities.Pago_entity import PagoEntity

class PagoRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: PagoEntity)-> PagoEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> PagoEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[PagoEntity] | PagoEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[PagoEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

