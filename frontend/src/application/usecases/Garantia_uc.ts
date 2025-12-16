import { GarantiaEntity } from '../../domain/entities/Garantia_entity';
import type { Gateway } from '../service/gateway';
export class GarantiaUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

  async get(id?: string): Promise<any> {
    try {
      const response = await this.api.get(`ventas/garantias/${id ?? ''}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo Garantia`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new GarantiaEntity(
            item.id,
            item.producto,
            item.usuario,
            item.precio,
            item.fecha_inicio,
            item.fecha_fin,
            item.descripcion,
            item.estado,
            item.created_at,
            item.updated_at,
            item.deleted_at,);
        });
      } else {
        return [];
      }
    } catch (error) {
      throw Error(`Error obteniendo Garantia: ${error}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await this.api.post(`ventas/garantias/`, {
        id: data.id,
        producto: data.producto,
        usuario: data.usuario,
        precio: data.precio,
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin,
        descripcion: data.descripcion,
        estado: data.estado
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error creando Garantia`) }
      if (Array.isArray(response.created)) {
        return response.created.map((item: Record<string, any>) => {
          return new GarantiaEntity(
            item.obj.id,
            item.obj.producto,
            item.obj.usuario,
            item.obj.precio,
            item.obj.fecha_inicio,
            item.obj.fecha_fin,
            item.obj.descripcion,
            item.obj.estado);
        });
      }
      return new GarantiaEntity(
        response.obj.id,
        response.obj.producto,
        response.obj.usuario,
        response.obj.precio,
        response.obj.fecha_inicio,
        response.obj.fecha_fin,
        response.obj.descripcion,
        response.obj.estado);
    } catch (error) {
      throw Error(`Error creando Garantia: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(`ventas/garantias/`, id, {
        'id': data.id,
        'producto': data.producto,
        'usuario': data.usuario,
        'precio': data.precio,
        'fecha_inicio': data.fecha_inicio,
        'fecha_fin': data.fecha_fin,
        'descripcion': data.descripcion,
        'estado': data.estado
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error actualizando Garantia`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new GarantiaEntity(
            item.obj.id,
            item.obj.producto,
            item.obj.usuario,
            item.obj.precio,
            item.obj.fecha_inicio,
            item.obj.fecha_fin,
            item.obj.descripcion,
            item.obj.estado);
        });
      }
      return new GarantiaEntity(
        response.obj.id,
        response.obj.producto,
        response.obj.usuario,
        response.obj.precio,
        response.obj.fecha_inicio,
        response.obj.fecha_fin,
        response.obj.descripcion,
        response.obj.estado);
    } catch (error) {
      throw Error(`Error actualizando Garantia: ${error}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await this.api.delete(`ventas/garantias/${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error eliminando Garantia`) }
      return response;
    } catch (error) {
      throw Error(`Error eliminando Garantia: ${error}`);
    }
  }

}

