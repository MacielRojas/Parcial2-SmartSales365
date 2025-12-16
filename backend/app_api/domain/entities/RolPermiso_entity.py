from dataclasses import dataclass
from app_api.domain.values.timestamp import TimestampModel

@dataclass(kw_only=True)
class RolPermisoEntity(TimestampModel):
    id: int | None
    rol: int
    permiso: int
