from dataclasses import dataclass
from app_api.domain.values.timestamp import TimestampModel

@dataclass(kw_only=True)
class MLmodelEntity(TimestampModel):
    id: int | None
    name: str
    version: str
    model_data: bytes
    description: str | None
