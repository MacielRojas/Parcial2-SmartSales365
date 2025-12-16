from dataclasses import dataclass
from app_api.domain.values.timestamp import TimestampModel

@dataclass(kw_only=True)
class UserRolEntity(TimestampModel):
    id: int | None
    user: int
    rol: int
