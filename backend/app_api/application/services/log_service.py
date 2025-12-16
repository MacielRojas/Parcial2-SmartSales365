from abc import ABC, abstractmethod

class LogService(ABC):
    @abstractmethod
    def log(self, accion, ip, usuario_id, fecha, hora, nivel):
        pass

    @abstractmethod
    def error(self, accion, ip, usuario_id, fecha, hora):
        pass

    @abstractmethod
    def warning(self, accion, ip, usuario_id, fecha, hora):
        pass

    @abstractmethod
    def info(self, accion, ip, usuario_id, fecha, hora):
        pass

    @abstractmethod
    def debug(self, accion, ip, usuario_id, fecha, hora):
        pass