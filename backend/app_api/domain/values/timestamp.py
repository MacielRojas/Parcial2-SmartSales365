from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

@dataclass(kw_only=True)
class TimestampModel:
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    deleted_at: Optional[datetime] = None

