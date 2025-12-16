from dataclasses import dataclass
from app_api.domain.values.timestamp import TimestampModel

@dataclass(kw_only=True)
class GaleriaEntity(TimestampModel):
    id: int | None
    producto: int
    imagen: str
