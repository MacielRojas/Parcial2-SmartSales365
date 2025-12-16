import { FacturaEntity } from '../../domain/entities/Factura_entity';
import type { Gateway } from '../service/gateway';
export class FacturaUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

  async get(id?: string): Promise<any> {
    try {
      const response = await this.api.get(`ventas/facturas/${id ?? ''}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo Factura`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new FacturaEntity(
            item.id,
            item.venta,
            item.fecha_expendida,
            item.nit,
            item.created_at,
            item.updated_at,
            item.deleted_at,);
        });
      } else {
        return [];
      }
    } catch (error) {
      throw Error(`Error obteniendo Factura: ${error}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await this.api.post(`ventas/facturas/`, {
        id: data.id,
        venta: data.venta,
        fecha_expendida: data.fecha_expendida,
        nit: data.nit
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error creando Factura`) }
      if (Array.isArray(response.created)) {
        return response.created.map((item: Record<string, any>) => {
          return new FacturaEntity(
            item.obj.id,
            item.obj.venta,
            item.obj.fecha_expendida,
            item.obj.nit);
        });
      }
      return new FacturaEntity(
        response.obj.id,
        response.obj.venta,
        response.obj.fecha_expendida,
        response.obj.nit);
    } catch (error) {
      throw Error(`Error creando Factura: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(`ventas/facturas/`, id, {
        'id': data.id,
        'venta': data.venta,
        'fecha_expendida': data.fecha_expendida,
        'nit': data.nit
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error actualizando Factura`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new FacturaEntity(
            item.obj.id,
            item.obj.venta,
            item.obj.fecha_expendida,
            item.obj.nit);
        });
      }
      return new FacturaEntity(
        response.obj.id,
        response.obj.venta,
        response.obj.fecha_expendida,
        response.obj.nit);
    } catch (error) {
      throw Error(`Error actualizando Factura: ${error}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await this.api.delete(`ventas/facturas/${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error eliminando Factura`) }
      return response;
    } catch (error) {
      throw Error(`Error eliminando Factura: ${error}`);
    }
  }

}

