from app_api.domain.entities.Bitacora_entity import BitacoraEntity

from app_api.application.repositories.Bitacora_repository import BitacoraRepository

class BitacoraUseCase:
    def __init__(self, repository: BitacoraRepository):
        self.repository = repository

    def get(self, **kwargs)->list[BitacoraEntity] | BitacoraEntity:
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

    def create(self, usuario:int, accion:str, ipv4:str, nivel:str)-> BitacoraEntity:
        if not all([usuario, accion, ipv4, nivel]):
            raise Exception("Todos los campos son obligatorios: usuario, accion, ipv4, nivel")
        try:
            obj = self.repository.save(BitacoraEntity(
                id=None,
                usuario=usuario,
                accion=accion,
                ipv4=ipv4,
                nivel=nivel))
            if not obj:
                raise Exception("No se pudo crear el registro")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> BitacoraEntity:
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
            obj = BitacoraEntity(**data)
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

