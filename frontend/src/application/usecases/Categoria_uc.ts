import { CategoriaEntity } from '../../domain/entities/Categoria_entity';
import type { Gateway } from '../service/gateway';
export class CategoriaUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

  async get(id?: string): Promise<any> {
    try {
      const response = await this.api.get(`ventas/categorias/${id ?? ''}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo Categoria`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new CategoriaEntity(
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
      throw Error(`Error obteniendo Categoria: ${error}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await this.api.post(`ventas/categorias/`, {
        id: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error creando Categoria`) }
      if (Array.isArray(response.created)) {
        return response.created.map((item: Record<string, any>) => {
          return new CategoriaEntity(
            item.obj.id,
            item.obj.nombre,
            item.obj.descripcion);
        });
      }
      return new CategoriaEntity(
        response.obj.id,
        response.obj.nombre,
        response.obj.descripcion);
    } catch (error) {
      throw Error(`Error creando Categoria: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(`ventas/categorias/`, id, {
        'id': data.id,
        'nombre': data.nombre,
        'descripcion': data.descripcion
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error actualizando Categoria`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new CategoriaEntity(
            item.obj.id,
            item.obj.nombre,
            item.obj.descripcion);
        });
      }
      return new CategoriaEntity(
        response.obj.id,
        response.obj.nombre,
        response.obj.descripcion);
    } catch (error) {
      throw Error(`Error actualizando Categoria: ${error}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await this.api.delete(`ventas/categorias/${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error eliminando Categoria`) }
      return response;
    } catch (error) {
      throw Error(`Error eliminando Categoria: ${error}`);
    }
  }

}

