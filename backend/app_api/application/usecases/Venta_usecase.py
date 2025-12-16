from app_api.domain.entities.Venta_entity import VentaEntity

from app_api.application.repositories.Venta_repository import VentaRepository

class VentaUseCase:
    def __init__(self, repository: VentaRepository):
        self.repository = repository

    def get(self, **kwargs)->list[VentaEntity] | VentaEntity:
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

    def create(self, carrito:int, pago:int)-> VentaEntity:
        if not all([carrito, pago]):
            raise Exception("Todos los campos son obligatorios: carrito, pago")
        try:
            obj = self.repository.save(VentaEntity(
                id=None,
                carrito=carrito,
                pago=pago))
            if not obj:
                raise Exception("No se pudo crear el registro")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> VentaEntity:
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
            obj = VentaEntity(**data)
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

