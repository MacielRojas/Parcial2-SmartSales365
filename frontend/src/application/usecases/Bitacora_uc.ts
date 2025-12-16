import { BitacoraEntity } from '../../domain/entities/Bitacora_entity';
import type { Gateway } from '../service/gateway';
export class BitacoraUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

  async get(id?: string): Promise<any> {
    try {
      const response = await this.api.get(`especiales/bitacora/${id ?? ''}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo Bitacora`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new BitacoraEntity(
            item.id,
            item.usuario,
            item.accion,
            item.ipv4,
            item.nivel,
            item.created_at,
            item.updated_at,
            item.deleted_at,
          );
        });
      } else {
        return [];
      }
    } catch (error) {
      throw Error(`Error obteniendo Bitacora: ${error}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await this.api.post(`especiales/bitacora/`, {
        id: data.id,
        usuario: data.usuario,
        accion: data.accion,
        ipv4: data.ipv4,
        nivel: data.nivel
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error creando Bitacora`) }
      if (Array.isArray(response.created)) {
        return response.created.map((item: Record<string, any>) => {
          return new BitacoraEntity(
            item.obj.id,
            item.obj.usuario,
            item.obj.accion,
            item.obj.ipv4,
            item.obj.nivel);
        });
      }
      return new BitacoraEntity(
        response.obj.id,
        response.obj.usuario,
        response.obj.accion,
        response.obj.ipv4,
        response.obj.nivel);
    } catch (error) {
      throw Error(`Error creando Bitacora: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(`especiales/bitacora/`, id, {
        'id': data.id,
        'usuario': data.usuario,
        'accion': data.accion,
        'ipv4': data.ipv4,
        'nivel': data.nivel
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error actualizando Bitacora`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new BitacoraEntity(
            item.obj.id,
            item.obj.usuario,
            item.obj.accion,
            item.obj.ipv4,
            item.obj.nivel);
        });
      }
      return new BitacoraEntity(
        response.obj.id,
        response.obj.usuario,
        response.obj.accion,
        response.obj.ipv4,
        response.obj.nivel);
    } catch (error) {
      throw Error(`Error actualizando Bitacora: ${error}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await this.api.delete(`especiales/bitacora/${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error eliminando Bitacora`) }
      return response;
    } catch (error) {
      throw Error(`Error eliminando Bitacora: ${error}`);
    }
  }

}

