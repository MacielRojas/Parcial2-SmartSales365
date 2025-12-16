import { DescuentoEntity } from '../../domain/entities/Descuento_entity';
import type { Gateway } from '../service/gateway';
export class DescuentoUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

  async get(id?: string): Promise<any> {
    try {
      const response = await this.api.get(`ventas/descuentos/${id ?? ''}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo Descuento`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new DescuentoEntity(
            item.id,
            item.tipo,
            item.producto,
            item.valor,
            item.fecha_inicio,
            item.fecha_fin,
            item.created_at,
            item.updated_at,
            item.deleted_at,);
        });
      } else {
        return [];
      }
    } catch (error) {
      throw Error(`Error obteniendo Descuento: ${error}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await this.api.post(`ventas/descuentos/`, {
        id: data.id,
        tipo: data.tipo,
        producto: data.producto,
        valor: data.valor,
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error creando Descuento`) }
      if (Array.isArray(response.created)) {
        return response.created.map((item: Record<string, any>) => {
          return new DescuentoEntity(
            item.obj.id,
            item.obj.tipo,
            item.obj.producto,
            item.obj.valor,
            item.obj.fecha_inicio,
            item.obj.fecha_fin);
        });
      }
      return new DescuentoEntity(
        response.obj.id,
        response.obj.tipo,
        response.obj.producto,
        response.obj.valor,
        response.obj.fecha_inicio,
        response.obj.fecha_fin);
    } catch (error) {
      throw Error(`Error creando Descuento: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(`ventas/descuentos/`, id, {
        'id': data.id,
        'tipo': data.tipo,
        'producto': data.producto,
        'valor': data.valor,
        'fecha_inicio': data.fecha_inicio,
        'fecha_fin': data.fecha_fin
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error actualizando Descuento`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new DescuentoEntity(
            item.obj.id,
            item.obj.tipo,
            item.obj.producto,
            item.obj.valor,
            item.obj.fecha_inicio,
            item.obj.fecha_fin);
        });
      }
      return new DescuentoEntity(
        response.obj.id,
        response.obj.tipo,
        response.obj.producto,
        response.obj.valor,
        response.obj.fecha_inicio,
        response.obj.fecha_fin);
    } catch (error) {
      throw Error(`Error actualizando Descuento: ${error}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await this.api.delete(`ventas/descuentos/${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error eliminando Descuento`) }
      return response;
    } catch (error) {
      throw Error(`Error eliminando Descuento: ${error}`);
    }
  }

}

