from abc import ABC, abstractmethod
from typing import Any

class ReporteSqlRepository(ABC):
    @abstractmethod
    def get(self, stringsql:str, params: dict | None = None)->list:
        pass

class ReportesRepository(ABC):
    @abstractmethod
    def get(self, tabla, fecha_inicio, fecha_fin, atributos, filtros)->list:
        pass