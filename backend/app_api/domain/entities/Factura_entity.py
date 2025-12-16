from dataclasses import dataclass
from datetime import date
from app_api.domain.values.timestamp import TimestampModel

@dataclass(kw_only=True)
class FacturaEntity(TimestampModel):
    id: int | None
    venta: int
    fecha_expendida: date | None
    nit: str | None
