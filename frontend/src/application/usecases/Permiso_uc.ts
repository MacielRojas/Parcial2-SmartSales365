import { PermisoEntity } from '../../domain/entities/Permiso_entity';
import type { Gateway } from '../service/gateway';
export class PermisoUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

  async get(id?: string): Promise<any> {
    try {
      const response = await this.api.get(`usuarios/permisos/${id ?? ''}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo Permiso`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new PermisoEntity(
            item.id,
            item.nombre,
            item.descripcion,
            item.created_at,
            item.updated_at,
            item.deleted_at,);
        });
      } else {
        return [];
      }
    } catch (error) {
      throw Error(`Error obteniendo Permiso: ${error}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await this.api.post(`usuarios/permisos/`, {
        id: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error creando Permiso`) }
      if (Array.isArray(response.created)) {
        return response.created.map((item: Record<string, any>) => {
          return new PermisoEntity(
            item.obj.id,
            item.obj.nombre,
            item.obj.descripcion);
        });
      }
      return new PermisoEntity(
        response.obj.id,
        response.obj.nombre,
        response.obj.descripcion);
    } catch (error) {
      throw Error(`Error creando Permiso: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(`usuarios/permisos/`, id, {
        'id': data.id,
        'nombre': data.nombre,
        'descripcion': data.descripcion
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error actualizando Permiso`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new PermisoEntity(
            item.obj.id,
            item.obj.nombre,
            item.obj.descripcion);
        });
      }
      return new PermisoEntity(
        response.obj.id,
        response.obj.nombre,
        response.obj.descripcion);
    } catch (error) {
      throw Error(`Error actualizando Permiso: ${error}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await this.api.delete(`usuarios/permisos/${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error eliminando Permiso`) }
      return response;
    } catch (error) {
      throw Error(`Error eliminando Permiso: ${error}`);
    }
  }

}

