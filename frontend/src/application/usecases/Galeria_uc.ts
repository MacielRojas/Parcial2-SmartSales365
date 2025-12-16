import { GaleriaEntity } from '../../domain/entities/Galeria_entity';
import type { Gateway } from '../service/gateway';
export class GaleriaUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

  async get(id?: string): Promise<any> {
    try {
      const response = await this.api.get(`ventas/galerias/${id ?? ''}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo Galeria`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new GaleriaEntity(
            item.id,
            item.producto,
            item.imagen,
            item.created_at,
            item.updated_at,
            item.deleted_at,);
        });
      } else {
        return [];
      }
    } catch (error) {
      throw Error(`Error obteniendo Galeria: ${error}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await this.api.post(`ventas/galerias/`, {
        id: data.id,
        producto: data.producto,
        imagen: data.imagen
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error creando Galeria`) }
      if (Array.isArray(response.created)) {
        return response.created.map((item: Record<string, any>) => {
          return new GaleriaEntity(
            item.obj.id,
            item.obj.producto,
            item.obj.imagen);
        });
      }
      return new GaleriaEntity(
        response.obj.id,
        response.obj.producto,
        response.obj.imagen);
    } catch (error) {
      throw Error(`Error creando Galeria: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(`ventas/galerias/`, id, {
        'id': data.id,
        'producto': data.producto,
        'imagen': data.imagen
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error actualizando Galeria`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new GaleriaEntity(
            item.obj.id,
            item.obj.producto,
            item.obj.imagen);
        });
      }
      return new GaleriaEntity(
        response.obj.id,
        response.obj.producto,
        response.obj.imagen);
    } catch (error) {
      throw Error(`Error actualizando Galeria: ${error}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await this.api.delete(`ventas/galerias/${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error eliminando Galeria`) }
      return response;
    } catch (error) {
      throw Error(`Error eliminando Galeria: ${error}`);
    }
  }

}

