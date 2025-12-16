from dataclasses import dataclass
from app_api.domain.values.timestamp import TimestampModel

@dataclass(kw_only=True)
class PermisoEntity(TimestampModel):
    id: int | None
    nombre: str
    descripcion: str | None
