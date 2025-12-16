from app_api.domain.entities.Producto_entity import ProductoEntity

from app_api.application.repositories.Producto_repository import ProductoRepository

class ProductoUseCase:
    def __init__(self, repository: ProductoRepository):
        self.repository = repository

    def get(self, **kwargs)->list[ProductoEntity] | ProductoEntity:
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

    def create(self, nombre:str, precio:int, stock:int, codigo:str, marca:str, categoria:int)-> ProductoEntity:
        if not all([nombre, precio, stock, codigo, marca, categoria]):
            raise Exception("Todos los campos son obligatorios: nombre, precio, stock, codigo, marca, categoria")
        try:
            obj = self.repository.save(ProductoEntity(
                id=None,
                nombre=nombre,
                precio=precio,
                stock=stock,
                codigo=codigo,
                marca=marca,
                categoria=categoria))
            if not obj:
                raise Exception("No se pudo crear el registro")
            return obj
        except Exception as e:
            raise Exception(f"No se pudo crear el registro: {e}")

    def update(self, id, **kwargs)-> ProductoEntity:
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
            obj = ProductoEntity(**data)
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

