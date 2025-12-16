from abc import ABC, abstractmethod
from io import BytesIO, StringIO

class DocService(ABC):
    
    @abstractmethod
    def generar_excel(self, data:list[dict], nombre_doc="reporte")-> BytesIO:
        pass
    
    @abstractmethod 
    def generar_pdf(self, data:list[dict], nombre_doc="reporte")-> BytesIO:
        pass
    
    @abstractmethod
    def generar_csv(self, data:list[dict], nombre_doc="reporte")-> StringIO:
        pass