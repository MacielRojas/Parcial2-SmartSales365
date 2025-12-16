from abc import ABC, abstractmethod
from app_api.domain.entities.Garantia_entity import GarantiaEntity

class GarantiaRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: GarantiaEntity)-> GarantiaEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> GarantiaEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[GarantiaEntity] | GarantiaEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[GarantiaEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

