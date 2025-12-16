import { ProductoEntity } from '../../domain/entities/Producto_entity';
import type { Gateway } from '../service/gateway';
export class ProductoUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

  async get(id?: string): Promise<any> {
    try {
      const response = await this.api.get(`ventas/productos/${id ?? ''}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo Producto`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new ProductoEntity(
            item.id,
            item.nombre,
            item.precio,
            item.stock,
            item.codigo,
            item.marca,
            item.categoria,
            item.created_at,
            item.updated_at,
            item.deleted_at,);
        });
      } else {
        return [];
      }
    } catch (error) {
      throw Error(`Error obteniendo Producto: ${error}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await this.api.post(`ventas/productos/`, {
        id: data.id,
        nombre: data.nombre,
        precio: data.precio,
        stock: data.stock,
        codigo: data.codigo,
        marca: data.marca,
        categoria: data.categoria
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error creando Producto`) }
      if (Array.isArray(response.created)) {
        return response.created.map((item: Record<string, any>) => {
          return new ProductoEntity(
            item.obj.id,
            item.obj.nombre,
            item.obj.precio,
            item.obj.stock,
            item.obj.codigo,
            item.obj.marca,
            item.obj.categoria);
        });
      }
      return new ProductoEntity(
        response.obj.id,
        response.obj.nombre,
        response.obj.precio,
        response.obj.stock,
        response.obj.codigo,
        response.obj.marca,
        response.obj.categoria);
    } catch (error) {
      throw Error(`Error creando Producto: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(`ventas/productos/`, id, {
        'id': data.id,
        'nombre': data.nombre,
        'precio': data.precio,
        'stock': data.stock,
        'codigo': data.codigo,
        'marca': data.marca,
        'categoria': data.categoria
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error actualizando Producto`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new ProductoEntity(
            item.obj.id,
            item.obj.nombre,
            item.obj.precio,
            item.obj.stock,
            item.obj.codigo,
            item.obj.marca,
            item.obj.categoria);
        });
      }
      return new ProductoEntity(
        response.obj.id,
        response.obj.nombre,
        response.obj.precio,
        response.obj.stock,
        response.obj.codigo,
        response.obj.marca,
        response.obj.categoria);
    } catch (error) {
      throw Error(`Error actualizando Producto: ${error}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await this.api.delete(`ventas/productos/${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error eliminando Producto`) }
      return response;
    } catch (error) {
      throw Error(`Error eliminando Producto: ${error}`);
    }
  }

}

