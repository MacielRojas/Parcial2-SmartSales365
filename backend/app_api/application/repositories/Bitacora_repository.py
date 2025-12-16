from abc import ABC, abstractmethod
from app_api.domain.entities.Bitacora_entity import BitacoraEntity

class BitacoraRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: BitacoraEntity)-> BitacoraEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> BitacoraEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[BitacoraEntity] | BitacoraEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[BitacoraEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

