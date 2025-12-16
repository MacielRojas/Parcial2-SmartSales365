import {VentaEntity} from '../../domain/entities/Venta_entity';
import type { Gateway } from '../service/gateway';
export class VentaUseCase {
  api: Gateway;
  constructor(api: Gateway) {
    this.api = api;
  }

async get(id?:string): Promise<any>{
  try {
    const response = await this.api.get(`ventas/ventas/${id??''}`);
    if (response.status < 200 || response.status > 299 ){throw Error(`Error obteniendo Venta`)}
    if (Array.isArray(response.obj)) {
      return response.obj.map((item: Record<string, any>) => {
        return new VentaEntity(
          item.id,
          item.carrito,
          item.pago,
          item.created_at,
          item.updated_at,
          item.deleted_at,);
        });
    } else
{      return [];
    } } catch (error) {
      throw Error(`Error obteniendo Venta: ${error}`);
    }
  }

async create(data:any):Promise<any> {
try{
const response = await this.api.post(`ventas/ventas/`, {
          id: data.id,
          carrito: data.carrito,
          pago: data.pago
        });
if (response.status < 200 || response.status > 299 ){throw Error(`Error creando Venta`)}
if (Array.isArray(response.created)) {
  return response.created.map((item: Record<string, any>) => {
    return new VentaEntity(
          item.obj.id,
          item.obj.carrito,
          item.obj.pago);
    });
  }
  return new VentaEntity(
          response.obj.id,
          response.obj.carrito,
          response.obj.pago);
  }catch(error){
    throw Error(`Error creando Venta: ${error}`);
  }
}

async update(id:string, data:any):Promise<any> {
try{
const response = await this.api.put(`ventas/ventas/`, id, {
          'id': data.id,
          'carrito': data.carrito,
          'pago': data.pago
        });
if (response.status < 200 || response.status > 299 ){throw Error(`Error actualizando Venta`)}
if (Array.isArray(response.obj)) {
  return response.obj.map((item: Record<string, any>) => {
    return new VentaEntity(
          item.obj.id,
          item.obj.carrito,
          item.obj.pago);
});
  }
  return new VentaEntity(
          response.obj.id,
          response.obj.carrito,
          response.obj.pago);
    }catch(error){
      throw Error(`Error actualizando Venta: ${error}`);
    }
  }

async delete(id:string):Promise<any> {
try{
  const response = await this.api.delete(`ventas/ventas/${id}`);
  if (response.status < 200 || response.status > 299 ){throw Error(`Error eliminando Venta`)}
  return response;
}catch(error){
  throw Error(`Error eliminando Venta: ${error}`);
}
}

}

