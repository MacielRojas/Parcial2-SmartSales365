from app_api.application.services.log_service import LogService
from app_api.application.usecases.Bitacora_usecase import BitacoraUseCase
from app_api.application.repositories.Bitacora_repository import BitacoraRepository

class DBLog(LogService):
    def __init__(self, repository: BitacoraRepository):
        self.bitacora_uc = BitacoraUseCase(repository=repository)

    def log(self, accion, ip, usuario_id, fecha, hora, nivel):
        try:
            self.bitacora_uc.create(nivel=nivel, usuario=usuario_id, accion=accion, ipv4=ip)
        except Exception as e:
            raise Exception(f"Error al registrar el log en la base de datos: {e}")

    def error(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "ERROR")

    def warning(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "WARNING")

    def info(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "INFO")

    def debug(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "DEBUG")