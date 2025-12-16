import { MantenimientoEntity } from '../../domain/entities/Mantenimiento_entity';
import type { Gateway } from '../service/gateway';
export class MantenimientoUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

  async get(id?: string): Promise<any> {
    try {
      const response = await this.api.get(`ventas/mantenimientos/${id ?? ''}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo Mantenimiento`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new MantenimientoEntity(
            item.id,
            item.producto,
            item.precio,
            item.fecha_programada,
            item.estado,
            item.usuario,
            item.created_at,
            item.updated_at,
            item.deleted_at,);
        });
      } else {
        return [];
      }
    } catch (error) {
      throw Error(`Error obteniendo Mantenimiento: ${error}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await this.api.post(`ventas/mantenimientos/`, {
        id: data.id,
        producto: data.producto,
        precio: data.precio,
        fecha_programada: data.fecha_programada,
        estado: data.estado,
        usuario: data.usuario
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error creando Mantenimiento`) }
      if (Array.isArray(response.created)) {
        return response.created.map((item: Record<string, any>) => {
          return new MantenimientoEntity(
            item.obj.id,
            item.obj.producto,
            item.obj.precio,
            item.obj.fecha_programada,
            item.obj.estado,
            item.obj.usuario);
        });
      }
      return new MantenimientoEntity(
        response.obj.id,
        response.obj.producto,
        response.obj.precio,
        response.obj.fecha_programada,
        response.obj.estado,
        response.obj.usuario);
    } catch (error) {
      throw Error(`Error creando Mantenimiento: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(`ventas/mantenimientos/`, id, {
        'id': data.id,
        'producto': data.producto,
        'precio': data.precio,
        'fecha_programada': data.fecha_programada,
        'estado': data.estado,
        'usuario': data.usuario
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error actualizando Mantenimiento`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new MantenimientoEntity(
            item.obj.id,
            item.obj.producto,
            item.obj.precio,
            item.obj.fecha_programada,
            item.obj.estado,
            item.obj.usuario);
        });
      }
      return new MantenimientoEntity(
        response.obj.id,
        response.obj.producto,
        response.obj.precio,
        response.obj.fecha_programada,
        response.obj.estado,
        response.obj.usuario);
    } catch (error) {
      throw Error(`Error actualizando Mantenimiento: ${error}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await this.api.delete(`ventas/mantenimientos/${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error eliminando Mantenimiento`) }
      return response;
    } catch (error) {
      throw Error(`Error eliminando Mantenimiento: ${error}`);
    }
  }

}

