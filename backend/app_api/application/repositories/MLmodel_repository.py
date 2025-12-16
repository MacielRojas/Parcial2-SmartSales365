from abc import ABC, abstractmethod
from app_api.domain.entities.MLmodel_entity import MLmodelEntity

class MLmodelRepository(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def save(self, obj: MLmodelEntity)-> MLmodelEntity:
        pass

    @abstractmethod
    def get_by_id(self, id)-> MLmodelEntity :
        pass

    @abstractmethod
    def get(self, **kwargs)->list[MLmodelEntity] | MLmodelEntity:
        pass

    @abstractmethod
    def exists_by_id(self, id)-> bool:
        pass

    @abstractmethod
    def get_all(self)-> list[MLmodelEntity]:
        pass

    @abstractmethod
    def delete(self, id)-> bool:
        pass

