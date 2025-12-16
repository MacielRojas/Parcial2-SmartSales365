from app_api.domain.entities.UserRol_entity import UserRolEntity

from app_api.application.repositories.UserRol_repository import UserRolRepository

class UserRolUseCase:
    def __init__(self, repository: UserRolRepository):
        self.repository = repository

    def get(self, **kwargs)->list[UserRolEntity] | UserRolEntity:
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

    def create(self, user:int, rol:int)-> UserRolEntity:
        if not all([user, rol]):
            raise Exception("Todos los campos son obligatorios: user, rol")
        try:
            obj = self.repository.save(UserRolEntity(
                id=None,
                user=user,
                rol=rol))
            if not obj:
                raise Exception("No se pudo crear el registro")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> UserRolEntity:
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
            obj = UserRolEntity(**data)
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

