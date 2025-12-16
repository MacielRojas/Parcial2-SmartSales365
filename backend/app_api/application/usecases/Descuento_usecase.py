from app_api.domain.entities.Descuento_entity import DescuentoEntity
from datetime import date
from app_api.application.repositories.Descuento_repository import DescuentoRepository

class DescuentoUseCase:
    def __init__(self, repository: DescuentoRepository):
        self.repository = repository

    def get(self, **kwargs)->list[DescuentoEntity] | DescuentoEntity:
        try:
            if not id:
                obj = self.repository.get_all()
            else:
                obj = self.repository.get(**kwargs)
            if obj is None:
                raise Exception("No se encontraron registros")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo obtener el registro: {e}")

    def create(self, tipo:str, producto:int, valor:int, fecha_inicio:date | None, fecha_fin:date | None)-> DescuentoEntity:
        if not all([tipo, producto, valor]):
            raise Exception("Todos los campos son obligatorios: tipo, producto, valor")
        try:
            obj = self.repository.save(DescuentoEntity(
                id=None,
                tipo=tipo,
                producto=producto,
                valor=valor,
                fecha_inicio=fecha_inicio,
                fecha_fin=fecha_fin))
            if not obj:
                raise Exception("No se pudo crear el registro")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> DescuentoEntity:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            obj = self.repository.get_by_id(id)
            if not obj:
                raise Exception("No se encontraron registros")
            data = obj.__dict__
            for key, value in kwargs.items():
                if key in data and key != 'id':
                    data[key] = value
            obj = DescuentoEntity(**data)
            return self.repository.save(obj)
        except Exception as e:
            raise Exception(f"No se pudo actualizar el registro: {e}")

    def delete(self, id)->bool:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            obj = self.repository.get_by_id(id)
            if not obj:
                raise Exception("No se encontraron registros")
            return self.repository.delete(id)
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

