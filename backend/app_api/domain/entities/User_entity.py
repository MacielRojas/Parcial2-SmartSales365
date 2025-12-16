from dataclasses import dataclass
from datetime import date
from app_api.domain.values.timestamp import TimestampModel

@dataclass(kw_only=True)
class UserEntity(TimestampModel):
    id: int | None
    username: str
    password: str
    email: str
    born_date: date | None
    gender: str | None
    first_name: str
    last_name: str
    is_active: bool
