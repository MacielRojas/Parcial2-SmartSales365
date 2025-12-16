import { CarritoEntity } from '../../domain/entities/Carrito_entity';
import type { Gateway } from '../service/gateway';
export class CarritoUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

  async get(id?: string): Promise<any> {
    try {
      const response = await this.api.get(`ventas/carritos/${id ?? ''}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo Carrito`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new CarritoEntity(
            item.id,
            item.usuario,
            item.total,
            item.descuento,
            item.created_at,
            item.updated_at,
            item.deleted_at,);
        });
      } else {
        return [];
      }
    } catch (error) {
      throw Error(`Error obteniendo Carrito: ${error}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await this.api.post(`ventas/carritos/`, {
        id: data.id,
        usuario: data.usuario,
        total: data.total,
        descuento: data.descuento
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error creando Carrito`) }
      if (Array.isArray(response.created)) {
        return response.created.map((item: Record<string, any>) => {
          return new CarritoEntity(
            item.obj.id,
            item.obj.usuario,
            item.obj.total,
            item.obj.descuento);
        });
      }
      return new CarritoEntity(
        response.obj.id,
        response.obj.usuario,
        response.obj.total,
        response.obj.descuento);
    } catch (error) {
      throw Error(`Error creando Carrito: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(`ventas/carritos/`, id, {
        'id': data.id,
        'usuario': data.usuario,
        'total': data.total,
        'descuento': data.descuento
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error actualizando Carrito`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new CarritoEntity(
            item.obj.id,
            item.obj.usuario,
            item.obj.total,
            item.obj.descuento);
        });
      }
      return new CarritoEntity(
        response.obj.id,
        response.obj.usuario,
        response.obj.total,
        response.obj.descuento);
    } catch (error) {
      throw Error(`Error actualizando Carrito: ${error}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await this.api.delete(`ventas/carritos/${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error eliminando Carrito`) }
      return response;
    } catch (error) {
      throw Error(`Error eliminando Carrito: ${error}`);
    }
  }

}

