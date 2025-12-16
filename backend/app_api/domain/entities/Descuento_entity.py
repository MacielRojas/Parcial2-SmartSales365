from dataclasses import dataclass
from app_api.domain.values.timestamp import TimestampModel
from datetime import date

@dataclass(kw_only=True)
class DescuentoEntity(TimestampModel):
    id: int | None
    tipo: str
    producto: int
    valor: int
    fecha_inicio: date | None
    fecha_fin: date | None
