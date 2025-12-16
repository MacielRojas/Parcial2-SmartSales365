from app_api.domain.entities.Pago_entity import PagoEntity

from app_api.application.repositories.Pago_repository import PagoRepository

class PagoUseCase:
    def __init__(self, repository: PagoRepository):
        self.repository = repository

    def get(self, **kwargs)->list[PagoEntity] | PagoEntity:
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

    def create(self, monto:int, moneda:str, estado:str, carrito:int, payment_method_id:str, payment_intent:str)-> PagoEntity:
        if not all([monto, moneda, estado, carrito, payment_method_id, payment_intent]):
            raise Exception("Todos los campos son obligatorios: monto, moneda, estado, carrito, payment_method_id, payment_intent")
        try:
            obj = self.repository.save(PagoEntity(
                id=None,
                monto=monto,
                moneda=moneda,
                estado=estado,
                carrito=carrito,
                payment_method_id=payment_method_id,
                payment_intent=payment_intent))
            if not obj:
                raise Exception("No se pudo crear el registro")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> PagoEntity:
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
            obj = PagoEntity(**data)
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

