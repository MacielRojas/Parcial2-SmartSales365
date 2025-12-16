from abc import ABC, abstractmethod

class REService(ABC):
    @abstractmethod
    def construir_query_completa(self, texto:str)->dict:
        pass

    @abstractmethod
    def extraer_fechas(self, texto:str)->dict|None:
        pass

    @abstractmethod
    def extraer_atributos(self, texto:str)->list:
        pass

    @abstractmethod
    def extraer_tablas(self, texto:str)->list:
        pass

    @abstractmethod
    def extraer_filtros(self, texto:str)->list:
        pass

    @abstractmethod
    def extraer_agregaciones(self, texto:str)->list:
        pass

    @abstractmethod
    def extraer_agrupamientos(self, texto:str)->list:
        pass

    @abstractmethod
    def extraer_ordenamientos(self, texto:str)->list:
        pass

    @abstractmethod
    def extraer_limites(self, texto:str)->int|None:
        pass

    @abstractmethod
    def extraer_joins(self, texto:str)->list:
        pass

    @abstractmethod
    def extraer_havings(self, texto:str)->list:
        pass