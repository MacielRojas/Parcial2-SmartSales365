from app_api.domain.entities.Galeria_entity import GaleriaEntity

from app_api.application.repositories.Galeria_repository import GaleriaRepository
from app_api.application.services.image_service import ImageService

class GaleriaUseCase:
    def __init__(self, repository: GaleriaRepository, cloud: ImageService):
        self.repository = repository
        self.cloud = cloud

    def get(self, **kwargs)->list[GaleriaEntity] | GaleriaEntity:
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

    def create(self, producto:int, imagen)-> GaleriaEntity:
        if not all([producto, imagen]):
            raise Exception("Todos los campos son obligatorios: producto, imagen")
        try:
            url_imagen = self.cloud.save_image(imagen)
            obj = self.repository.save(GaleriaEntity(
                id=None,
                producto=producto,
                imagen=url_imagen))
            if not obj:
                raise Exception("No se pudo crear el registro")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> GaleriaEntity:
        if not id:
            raise Exception("El id es obligatorio")
        try:
            obj = self.repository.get_by_id(id)
            if not obj:
                raise Exception("No se encontraron registros")
            data = obj.__dict__
            for key, value in kwargs.items():
                if key in data and key != 'id':
                    if key == 'imagen':
                        url_imagen = self.cloud.save_image(value)
                        value = url_imagen
                    data[key] = value
            obj = GaleriaEntity(**data)
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
            self.cloud.delete_image(obj.imagen)
            return self.repository.delete(id)
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")

