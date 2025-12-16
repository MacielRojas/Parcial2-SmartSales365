import type { Gateway } from "../service/gateway";
import { UsuarioUseCase } from "./usuario_uc";

export class AuthUseCase {
    api: Gateway;
    constructor(api: Gateway) {
        this.api = api;
    }

    async login(data: any): Promise<any> {
        try{
            const refreshToken = localStorage.getItem('refresh');
            if (!refreshToken){
                const response = await this.api.post(`usuarios/token/`, {
                    'email': data.email,
                    'password': data.password,
                });
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(`No se pudo iniciar sesión ${response.status}`);
                }    
                localStorage.setItem('refresh', response.refresh);
                localStorage.setItem('access', response.access);
                return true;
            }else{
                const response = await this.api.post(`usuarios/token/refresh/`, {
                    'refresh': refreshToken,
                });
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(`No se pudo iniciar sesión ${response.status}`);
                }
                localStorage.setItem('access', response.accessToken);
                return true;
            }
        }catch(error){
            throw Error(`Error login: ${error}`);
        }
    }

    async logout(): Promise<any> {
        try{
            const response = await this.api.post(`token/logout/`, {});
            return response;
        }catch(error){
            throw Error(`Error logout: ${error}`);
        }
    }

    async register (data: any): Promise<any> {
        try{
            const usuario_uc = new UsuarioUseCase(this.api);
            const usuario = await usuario_uc.create(data);
            if (!usuario){
                throw Error(`Error creando usuario`);
            }
            return usuario;
        }catch(error){
            throw Error(`Error register: ${error}`);
        }
    }
}
