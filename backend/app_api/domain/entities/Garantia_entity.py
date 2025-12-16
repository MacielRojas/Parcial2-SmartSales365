from dataclasses import dataclass
from datetime import date
from app_api.domain.values.timestamp import TimestampModel

@dataclass(kw_only=True)
class GarantiaEntity(TimestampModel):
    id: int | None
    producto: int
    usuario: int
    precio: int
    fecha_inicio: date | None
    fecha_fin: date | None
    descripcion: str | None
    estado: str
