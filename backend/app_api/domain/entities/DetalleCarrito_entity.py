from dataclasses import dataclass
from app_api.domain.values.timestamp import TimestampModel

@dataclass(kw_only=True)
class DetalleCarritoEntity(TimestampModel):
    id: int | None
    carrito: int
    producto: int
    cantidad: int
    descuento: int | None
