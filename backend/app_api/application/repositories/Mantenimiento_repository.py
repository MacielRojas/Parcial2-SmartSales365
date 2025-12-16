from abc import ABC, abstractmethod
from app_api.domain.entities.Mantenimiento_entity import MantenimientoEntity

class MantenimientoRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: MantenimientoEntity)-> MantenimientoEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> MantenimientoEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[MantenimientoEntity] | MantenimientoEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[MantenimientoEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

