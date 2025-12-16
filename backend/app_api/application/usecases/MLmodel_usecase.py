from app_api.domain.entities.MLmodel_entity import MLmodelEntity

from app_api.application.repositories.MLmodel_repository import MLmodelRepository

class MLmodelUseCase:
    def __init__(self, repository: MLmodelRepository):
        self.repository = repository

    def get(self, **kwargs)->list[MLmodelEntity] | MLmodelEntity:
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

    def create(self, name:str, version:str, model_data:bytes, description:str | None)-> MLmodelEntity:
        if not all([name, version, model_data]):
            raise Exception("Todos los campos son obligatorios: name, version, model_data")
        try:
            obj = self.repository.save(MLmodelEntity(
                id=None,
                name=name,
                version=version,
                model_data=model_data,
                description=description))
            if not obj:
                raise Exception("No se pudo crear el registro")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> MLmodelEntity:
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
            obj = MLmodelEntity(**data)
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

