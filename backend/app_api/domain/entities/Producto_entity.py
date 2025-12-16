from dataclasses import dataclass
from app_api.domain.values.timestamp import TimestampModel

@dataclass(kw_only=True)
class ProductoEntity(TimestampModel):
    id: int | None
    nombre: str
    precio: int
    stock: int
    codigo: str
    marca: str
    categoria: int
