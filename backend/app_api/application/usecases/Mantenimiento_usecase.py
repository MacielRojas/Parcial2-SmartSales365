from app_api.domain.entities.Mantenimiento_entity import MantenimientoEntity
from datetime import date
from app_api.application.repositories.Mantenimiento_repository import MantenimientoRepository

class MantenimientoUseCase:
    def __init__(self, repository: MantenimientoRepository):
        self.repository = repository

    def get(self, **kwargs)->list[MantenimientoEntity] | MantenimientoEntity:
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

    def create(self, producto:int, precio:int, fecha_programada:date | None, estado:str, usuario:int)-> MantenimientoEntity:
        if not all([producto, precio, estado, usuario]):
            raise Exception("Todos los campos son obligatorios: producto, precio, estado, usuario")
        try:
            obj = self.repository.save(MantenimientoEntity(
                id=None,
                producto=producto,
                precio=precio,
                fecha_programada=fecha_programada,
                estado=estado,
                usuario=usuario))
            if not obj:
                raise Exception("No se pudo crear el registro")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> MantenimientoEntity:
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
            obj = MantenimientoEntity(**data)
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

