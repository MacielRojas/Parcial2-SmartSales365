from dataclasses import dataclass
from app_api.domain.values.timestamp import TimestampModel

@dataclass(kw_only=True)
class VentaEntity(TimestampModel):
    id: int | None
    carrito: int
    pago: int
