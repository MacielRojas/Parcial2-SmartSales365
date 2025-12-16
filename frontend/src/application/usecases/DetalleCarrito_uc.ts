import { DetalleCarritoEntity } from '../../domain/entities/DetalleCarrito_entity';
import type { Gateway } from '../service/gateway';
export class DetalleCarritoUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

  async get(id?: string): Promise<any> {
    try {
      const response = await this.api.get(`ventas/detallescarrito/${id ?? ''}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo DetalleCarrito`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new DetalleCarritoEntity(
            item.id,
            item.carrito,
            item.producto,
            item.cantidad,
            item.descuento,
            item.created_at,
            item.updated_at,
            item.deleted_at,);
        });
      } else {
        return [];
      }
    } catch (error) {
      throw Error(`Error obteniendo DetalleCarrito: ${error}`);
    }
  }

  async getbycartid(cart_id: string): Promise<any> {
    try {
      const response = await this.api.get(`ventas/detallescarrito?carrito=${cart_id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo DetalleCarrito`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new DetalleCarritoEntity(
            item.id,
            item.carrito,
            item.producto,
            item.cantidad,
            item.descuento,
            item.created_at,
            item.updated_at,
            item.deleted_at,);
        });
      } else {
        return [];
      }
    } catch (error) {
      throw Error(`Error obteniendo DetalleCarrito: ${error}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await this.api.post(`ventas/detallescarrito/`, {
        id: data.id,
        carrito: data.carrito,
        producto: data.producto,
        cantidad: data.cantidad,
        descuento: data.descuento
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error creando DetalleCarrito`) }
      if (Array.isArray(response.created)) {
        return response.created.map((item: Record<string, any>) => {
          return new DetalleCarritoEntity(
            item.obj.id,
            item.obj.carrito,
            item.obj.producto,
            item.obj.cantidad,
            item.obj.descuento);
        });
      }
      return new DetalleCarritoEntity(
        response.obj.id,
        response.obj.carrito,
        response.obj.producto,
        response.obj.cantidad,
        response.obj.descuento);
    } catch (error) {
      throw Error(`Error creando DetalleCarrito: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(`ventas/detallescarrito/`, id, {
        'id': data.id,
        'carrito': data.carrito,
        'producto': data.producto,
        'cantidad': data.cantidad,
        'descuento': data.descuento
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error actualizando DetalleCarrito`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new DetalleCarritoEntity(
            item.obj.id,
            item.obj.carrito,
            item.obj.producto,
            item.obj.cantidad,
            item.obj.descuento);
        });
      }
      return new DetalleCarritoEntity(
        response.obj.id,
        response.obj.carrito,
        response.obj.producto,
        response.obj.cantidad,
        response.obj.descuento);
    } catch (error) {
      throw Error(`Error actualizando DetalleCarrito: ${error}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await this.api.delete(`ventas/detallescarrito/${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error eliminando DetalleCarrito`) }
      return response;
    } catch (error) {
      throw Error(`Error eliminando DetalleCarrito: ${error}`);
    }
  }

}

