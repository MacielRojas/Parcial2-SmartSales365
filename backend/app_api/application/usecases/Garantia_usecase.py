from app_api.domain.entities.Garantia_entity import GarantiaEntity
from datetime import date
from app_api.application.repositories.Garantia_repository import GarantiaRepository

class GarantiaUseCase:
    def __init__(self, repository: GarantiaRepository):
        self.repository = repository

    def get(self, **kwargs)->list[GarantiaEntity] | GarantiaEntity:
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

    def create(self, producto:int, usuario:int, precio:int, fecha_inicio:date | None, fecha_fin:date | None, descripcion:str | None, estado:str)-> GarantiaEntity:
        if not all([producto, usuario, precio, estado]):
            raise Exception("Todos los campos son obligatorios: producto, usuario, precio, estado")
        try:
            obj = self.repository.save(GarantiaEntity(
                id=None,
                producto=producto,
                usuario=usuario,
                precio=precio,
                fecha_inicio=fecha_inicio,
                fecha_fin=fecha_fin,
                descripcion=descripcion,
                estado=estado))
            if not obj:
                raise Exception("No se pudo crear el registro")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> GarantiaEntity:
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
            obj = GarantiaEntity(**data)
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

