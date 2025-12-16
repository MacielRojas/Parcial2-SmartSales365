from abc import ABC, abstractmethod
class PagoService(ABC):
    @abstractmethod
    def crear_pago(self, amount:int, payment_method_id:str, currency:str, **kwargs)->dict:
        pass

    @abstractmethod
    def confirmar_pago(self, id:str)->dict:
        pass

    @abstractmethod
    def cancelar_pago(self, id:str)->dict:
        pass

    @abstractmethod
    def obtener_pago(self, id:str)->dict:
        pass

    @abstractmethod
    def obtener_reembolso(self, charge_id:str, amount:int)->dict:
        pass

    @abstractmethod
    def handle_webhook(self, payload:bytes, sigheader:str)->dict:
        pass