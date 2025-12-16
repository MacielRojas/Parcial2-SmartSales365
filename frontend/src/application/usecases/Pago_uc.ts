import { PagoEntity } from '../../domain/entities/Pago_entity';
import type { Gateway } from '../service/gateway';
export class PagoUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

  async get(id?: string): Promise<any> {
    try {
      const response = await this.api.get(`ventas/pagos/${id ?? ''}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error obteniendo Pago`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new PagoEntity(
            item.id,
            item.monto,
            item.moneda,
            item.estado,
            item.carrito,
            item.payment_method_id,
            item.payment_intent,
            item.created_at,
            item.updated_at,
            item.deleted_at,);
        });
      } else {
        return [];
      }
    } catch (error) {
      throw Error(`Error obteniendo Pago: ${error}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await this.api.post(`ventas/pagos/`, {
        id: data.id,
        monto: data.monto,
        moneda: data.moneda,
        estado: data.estado,
        carrito: data.carrito,
        payment_method_id: data.payment_method_id,
        payment_intent: data.payment_intent
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error creando Pago`) }
      if (Array.isArray(response.created)) {
        return response.created.map((item: Record<string, any>) => {
          return new PagoEntity(
            item.obj.id,
            item.obj.monto,
            item.obj.moneda,
            item.obj.estado,
            item.obj.carrito,
            item.obj.payment_method_id,
            item.obj.payment_intent);
        });
      }
      return new PagoEntity(
        response.obj.id,
        response.obj.monto,
        response.obj.moneda,
        response.obj.estado,
        response.obj.carrito,
        response.obj.payment_method_id,
        response.obj.payment_intent);
    } catch (error) {
      throw Error(`Error creando Pago: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(`ventas/pagos/`, id, {
        'id': data.id,
        'monto': data.monto,
        'moneda': data.moneda,
        'estado': data.estado,
        'carrito': data.carrito,
        'payment_method_id': data.payment_method_id,
        'payment_intent': data.payment_intent
      });
      if (response.status < 200 || response.status > 299) { throw Error(`Error actualizando Pago`) }
      if (Array.isArray(response.obj)) {
        return response.obj.map((item: Record<string, any>) => {
          return new PagoEntity(
            item.obj.id,
            item.obj.monto,
            item.obj.moneda,
            item.obj.estado,
            item.obj.carrito,
            item.obj.payment_method_id,
            item.obj.payment_intent);
        });
      }
      return new PagoEntity(
        response.obj.id,
        response.obj.monto,
        response.obj.moneda,
        response.obj.estado,
        response.obj.carrito,
        response.obj.payment_method_id,
        response.obj.payment_intent);
    } catch (error) {
      throw Error(`Error actualizando Pago: ${error}`);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await this.api.delete(`ventas/pagos/${id}`);
      if (response.status < 200 || response.status > 299) { throw Error(`Error eliminando Pago`) }
      return response;
    } catch (error) {
      throw Error(`Error eliminando Pago: ${error}`);
    }
  }

}

