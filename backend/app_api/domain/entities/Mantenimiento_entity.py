from dataclasses import dataclass
from app_api.domain.values.timestamp import TimestampModel
from datetime import date

@dataclass(kw_only=True)
class MantenimientoEntity(TimestampModel):
    id: int | None
    producto: int
    precio: int
    fecha_programada: date | None
    estado: str
    usuario: int
