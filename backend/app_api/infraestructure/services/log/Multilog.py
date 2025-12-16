from app_api.application.services.log_service import LogService

class MultiLog(LogService):
    def __init__(self, loggers: list[LogService]):
        self.loggers = loggers

    def log(self, accion, ip, usuario_id, fecha, hora, nivel):
        for logger in self.loggers:
            logger.log(accion, ip, usuario_id, fecha, hora, nivel)

    def error(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "ERROR")

    def warning(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "WARNING")

    def info(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "INFO")

    def debug(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "DEBUG")