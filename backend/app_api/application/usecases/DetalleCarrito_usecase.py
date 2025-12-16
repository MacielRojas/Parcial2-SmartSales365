from app_api.domain.entities.DetalleCarrito_entity import DetalleCarritoEntity

from app_api.application.repositories.DetalleCarrito_repository import DetalleCarritoRepository

class DetalleCarritoUseCase:
    def __init__(self, repository: DetalleCarritoRepository):
        self.repository = repository

    def get(self, **kwargs)->list[DetalleCarritoEntity] | DetalleCarritoEntity:
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

    def create(self, carrito:int, producto:int, cantidad:int, descuento:int | None)-> DetalleCarritoEntity:
        if not all([carrito, producto, cantidad]):
            raise Exception("Todos los campos son obligatorios: carrito, producto, cantidad")
        try:
            obj = self.repository.save(DetalleCarritoEntity(
                id=None,
                carrito=carrito,
                producto=producto,
                cantidad=cantidad,
                descuento=descuento)
            )
            if not obj:
                raise Exception("No se pudo crear el registro")
            
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> DetalleCarritoEntity:
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
            obj = DetalleCarritoEntity(**data)
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

