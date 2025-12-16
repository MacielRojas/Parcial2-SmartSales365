from app_api.domain.entities.RolPermiso_entity import RolPermisoEntity

from app_api.application.repositories.RolPermiso_repository import RolPermisoRepository

class RolPermisoUseCase:
    def __init__(self, repository: RolPermisoRepository):
        self.repository = repository

    def get(self, **kwargs)->list[RolPermisoEntity] | RolPermisoEntity:
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

    def create(self, rol:int, permiso:int)-> RolPermisoEntity:
        if not all([rol, permiso]):
            raise Exception("Todos los campos son obligatorios: rol, permiso")
        try:
            obj = self.repository.save(RolPermisoEntity(
                id=None,
                rol=rol,
                permiso=permiso))
            if not obj:
                raise Exception("No se pudo crear el registro")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> RolPermisoEntity:
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
            obj = RolPermisoEntity(**data)
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

