from dataclasses import dataclass
from app_api.domain.values.timestamp import TimestampModel

@dataclass(kw_only=True)
class CarritoEntity(TimestampModel):
    id: int | None
    usuario: int
    total: int
    descuento: int | None
