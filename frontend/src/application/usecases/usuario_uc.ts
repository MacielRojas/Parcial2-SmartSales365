import { User } from "../../domain/entities/Usuario";
import type { Gateway } from "../service/gateway";

export class UsuarioUseCase {
    api: Gateway;
    constructor(api: Gateway) {
        this.api = api;
    }

    async get(id?: string): Promise<any> {
        try{
            const response = await this.api.get(`usuarios/usuarios/${id??""}`);
            if (Array.isArray(response.obj)) {
                return response.obj.map((item: Record<string, any>) => {
                const user = new User(
                    item.id, 
                    item.username,
                    item.email, 
                    item.first_name, 
                    item.last_name,
                    item.born_date,
                    item.gender,
                    item.rol,
                    item.is_active,
          item.created_at,
          item.updated_at,
          item.deleted_at,
                );
                return user;
            });
                // return response.obj;
            } else {
                return [];
            }
        }catch(error){
            throw Error(`Error obteniendo usuarios: ${error}`);
        }
    }

    async create(data: Record<string, any>): Promise<any> {
        try{
            const response = await this.api.post(`usuarios/register/`, {
                "first_name": data.first_name,
                "last_name": data.last_name,
                "email": data.email,
                "username": data.username,
                "password": data.password,
                "rol": data.rol,
                "is_active": data.is_active,
                "born_date": data.born_date,
                "gender": data.gender,
            });
            if (response.status < 200 || response.status >= 300) {
                throw new Error(`No se pudo crear el usuario ${response.status}`);
            }
            if (Array.isArray(response.created)){
                return response.created.map((item: Record<string, any>) =>{
                    return new User(
                        item.obj.id, 
                        item.obj.username,
                        item.obj.email, 
                        item.obj.first_name, 
                        item.obj.last_name,
                        item.obj.born_date,
                        item.obj.gender,
                        item.obj.rol,
                        item.obj.is_active
                    );
                });
            }
            return new User(
                response.obj.id, 
                response.obj.username,
                response.obj.email, 
                response.obj.first_name, 
                response.obj.last_name,
                response.obj.born_date,
                response.obj.gender,
                response.obj.rol,
                response.obj.is_active
            );
        }catch(error){
            throw Error(`Error creando usuario: ${error}`);
        }
    }

    async update(id: string, data: Record<string, any>): Promise<any> {
        try{
            const response = await this.api.put(`usuarios/usuarios/`, id, {
                ...data
            });
            if (response.status < 200 || response.status >= 300) {
                throw Error(`No se pudo actualizar el usuario ${response.status}`);
            }
            return new User(
                response.obj.id, 
                response.obj.username,
                response.obj.email, 
                response.obj.first_name,
                response.obj.last_name,
                response.obj.born_date,
                response.obj.gender,
                response.obj.rol,
                response.obj.is_active
            );
        }catch(error){
            throw Error(`Error actualizando usuario: ${error}`);
        }
    }

    async delete(id: string): Promise<any> {
        try{
            const response = await this.api.delete(`usuarios/usuarios/${id}`);
            if (response.status < 200 || response.status >= 300) {
                throw Error(`No se pudo eliminar el usuario ${response.status}`);
            }
            return response;
        }catch(error){
            throw Error(`Error eliminando usuario: ${error}`);
        }
    }

}