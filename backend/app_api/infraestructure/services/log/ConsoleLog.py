from app_api.application.services.log_service import LogService

class ConsoleLog(LogService):
    def log(self, accion, ip, usuario_id, fecha, hora, nivel):
        print(f"""{nivel} - {accion} - {ip} - {usuario_id} - {fecha} - {hora}""")

    def error(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "ERROR")

    def warning(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "WARNING")

    def info(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "INFO")

    def debug(self, accion, ip, usuario_id, fecha, hora):
        self.log(accion, ip, usuario_id, fecha, hora, "DEBUG")