from app_api.domain.entities.Carrito_entity import CarritoEntity

from app_api.application.repositories.Carrito_repository import CarritoRepository

class CarritoUseCase:
    def __init__(self, repository: CarritoRepository):
        self.repository = repository

    def get(self, **kwargs)->list[CarritoEntity] | CarritoEntity:
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

    def create(self, usuario:int, total:int, descuento:int | None)-> CarritoEntity:
        if not all([usuario, total]):
            raise Exception("Todos los campos son obligatorios: usuario, total")
        try:
            obj = self.repository.save(CarritoEntity(
                id=None,
                usuario=usuario,
                total=total,
                descuento=descuento))
            if not obj:
                raise Exception("No se pudo crear el registro")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> CarritoEntity:
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
            obj = CarritoEntity(**data)
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

