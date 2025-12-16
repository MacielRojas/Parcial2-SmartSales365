from dataclasses import dataclass
from app_api.domain.values.timestamp import TimestampModel

@dataclass(kw_only=True)
class BitacoraEntity(TimestampModel):
    id: int | None
    usuario: int
    accion: str
    ipv4: str
    nivel: str
