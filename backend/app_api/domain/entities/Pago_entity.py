from dataclasses import dataclass
from app_api.domain.values.timestamp import TimestampModel

@dataclass(kw_only=True)
class PagoEntity(TimestampModel):
    id: int | None
    monto: int
    moneda: str
    estado: str
    carrito: int
    payment_method_id: str
    payment_intent: str
