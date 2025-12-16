from abc import ABC, abstractmethod
from app_api.domain.entities.Galeria_entity import GaleriaEntity

class GaleriaRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: GaleriaEntity)-> GaleriaEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> GaleriaEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[GaleriaEntity] | GaleriaEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[GaleriaEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

