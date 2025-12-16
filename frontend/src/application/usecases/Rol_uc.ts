import { RolEntity } from '../../domain/entities/Rol_entity';
import type { Gateway } from '../service/gateway';
export class RolUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

  async get(id?: string): Promise<any> {
    try {
      const response = await this.api.get(`usuarios/roles/${id ?? ''}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo Rol`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new RolEntity(
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
      throw Error(`Error obteniendo Rol: ${error}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await this.api.post(`usuarios/roles/`, {
        id: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error creando Rol`) }
      if (Array.isArray(response.created)) {
        return response.created.map((item: Record<string, any>) => {
          return new RolEntity(
            item.obj.id,
            item.obj.nombre,
            item.obj.descripcion);
        });
      }
      return new RolEntity(
        response.obj.id,
        response.obj.nombre,
        response.obj.descripcion);
    } catch (error) {
      throw Error(`Error creando Rol: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(`usuarios/roles/`, id, {
        'id': data.id,
        'nombre': data.nombre,
        'descripcion': data.descripcion
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error actualizando Rol`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new RolEntity(
            item.obj.id,
            item.obj.nombre,
            item.obj.descripcion);
        });
      }
      return new RolEntity(
        response.obj.id,
        response.obj.nombre,
        response.obj.descripcion);
    } catch (error) {
      throw Error(`Error actualizando Rol: ${error}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await this.api.delete(`usuarios/roles/${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error eliminando Rol`) }
      return response;
    } catch (error) {
      throw Error(`Error eliminando Rol: ${error}`);
    }
  }

}

