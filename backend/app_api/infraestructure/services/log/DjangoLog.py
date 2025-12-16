from app_api.application.services.log_service import LogService
import logging


class DjangoLog(LogService):
    def __init__(self):
        self.logger = logging

    def log(self, accion, ip, usuario_id, fecha, hora, nivel):
        self.logger.log(level=nivel, msg=f"""{accion} - {ip} - {usuario_id} - {fecha} - {hora}""")
    
    def error(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "ERROR")

    def warning(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "WARNING")

    def info(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "INFO")

    def debug(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "DEBUG")

    

    