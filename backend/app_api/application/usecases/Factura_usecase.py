from app_api.domain.entities.Factura_entity import FacturaEntity
from datetime import date
from app_api.application.repositories.Factura_repository import FacturaRepository

class FacturaUseCase:
    def __init__(self, repository: FacturaRepository):
        self.repository = repository

    def get(self, **kwargs)->list[FacturaEntity] | FacturaEntity:
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

    def create(self, venta:int, fecha_expendida:date | None, nit:str | None)-> FacturaEntity:
        if not all([venta]):
            raise Exception("Todos los campos son obligatorios: venta")
        try:
            obj = self.repository.save(FacturaEntity(
                id=None,
                venta=venta,
                fecha_expendida=fecha_expendida,
                nit=nit))
            if not obj:
                raise Exception("No se pudo crear el registro")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> FacturaEntity:
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
            obj = FacturaEntity(**data)
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

