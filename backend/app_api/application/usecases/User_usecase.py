from app_api.domain.entities.User_entity import UserEntity

from app_api.application.repositories.User_repository import UserRepository
from datetime import date
from app_api.application.services.auth.hasher import Hasher

class UserUseCase:
    def __init__(self, repository: UserRepository, hasher: Hasher):
        self.repository = repository
        self.hasher = hasher

    def get(self, **kwargs)->list[UserEntity] | UserEntity:
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

    def create(self, username:str, email:str, born_date:date | None, gender:str | None, first_name:str, last_name:str, password:str)-> UserEntity:
        if not all([username, email, first_name, last_name, password]):
            raise Exception("Todos los campos son obligatorios: username, email, first_name, last_name, password")
        try:
            obj = self.repository.save(
                UserEntity(
                    id=None,
                    password=self.hasher.hash(password),
                    username=username,
                    email=email,
                    born_date=born_date,
                    gender=gender,
                    first_name=first_name,
                    last_name=last_name,
                    is_active=True,
                )
            )
            if not obj:
                raise Exception("No se pudo crear el registro")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> UserEntity:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            obj = self.repository.get_by_id(id)
            if not obj:
                raise Exception("No se encontraron registros")
            data = obj.__dict__
            for key, value in kwargs.items():
                if key in data and key != 'id':
                    if key == 'password':
                        value = self.hasher.hash(value)
                    data[key] = value
            obj = UserEntity(**data)
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

