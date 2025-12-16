import { UserRolEntity } from '../../domain/entities/UserRol_entity';
import type { Gateway } from '../service/gateway';
export class UserRolUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

  async get(id?: string): Promise<any> {
    try {
      const response = await this.api.get(`usuarios/userroles/${id ?? ''}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo UserRol`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new UserRolEntity(
            item.id,
            item.user,
            item.rol,
          item.created_at,
          item.updated_at,
          item.deleted_at,
          );
        });
      } else {
        return [];
      }
    } catch (error) {
      throw Error(`Error obteniendo UserRol: ${error}`);
    }
  }

  async get_by_user(id: string): Promise<any> {
    try {
      const response = await this.api.get(`usuarios/userroles/?user=${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo UserRol`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new UserRolEntity(
            item.id,
            item.user,
            item.rol,
          item.created_at,
          item.updated_at,
          item.deleted_at,
          );
        });
      } else {
        return [];
      }
    }
    catch (error) {
      throw Error(`Error obteniendo UserRol: ${error}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await this.api.post(`usuarios/userroles/`, {
        id: data.id,
        user: data.user,
        rol: data.rol
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error creando UserRol`) }
      if (Array.isArray(response.created)) {
        return response.created.map((item: Record<string, any>) => {
          return new UserRolEntity(
            item.obj.id,
            item.obj.user,
            item.obj.rol);
        });
      }
      return new UserRolEntity(
        response.obj.id,
        response.obj.user,
        response.obj.rol);
    } catch (error) {
      throw Error(`Error creando UserRol: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(`usuarios/userroles/`, id, {
        'id': data.id,
        'user': data.user,
        'rol': data.rol
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error actualizando UserRol`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new UserRolEntity(
            item.obj.id,
            item.obj.user,
            item.obj.rol);
        });
      }
      return new UserRolEntity(
        response.obj.id,
        response.obj.user,
        response.obj.rol);
    } catch (error) {
      throw Error(`Error actualizando UserRol: ${error}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await this.api.delete(`usuarios/userroles/${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error eliminando UserRol`) }
      return response;
    } catch (error) {
      throw Error(`Error eliminando UserRol: ${error}`);
    }
  }

}

