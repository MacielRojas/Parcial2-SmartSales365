import type { Gateway } from "../service/gateway";

export class ReporteUseCase {
    api: Gateway;

    constructor(api: Gateway) {
        this.api = api;
    }

    async post_django(data: Record<string, any>): Promise<any> {
        try {
            const response = await this.api.post(`reportes/django/`, {
                ...data,
            });
            if (response.status <200 || response.status > 299){
                throw Error("No se pudo obtener el reporte");
            }
            return response.obj;
        } catch (error) {
            throw Error(`Error obteniendo reporte django: ${error}`);
        }
    }

    async post_file(data: Record<string, any>): Promise<any> {
        try {
            const response = await this.api.post(`reportes/file/`, {
                ...data,
            }, {}, true);
            if (response.status <200 || response.status > 299){
                throw Error("No se pudo obtener el reporte");
            }
            return response;
        } catch (error) {
            throw Error(`Error obteniendo reporte file: ${error}`);
        }
    }

    async post_reportenlp(data: Record<string, any>):Promise<any>{
        try{
            console.log(data);
            const response = await this.api.post('especiales/nlp/reportes/', {
                // debe contener "consulta"
                ...data
            });
            if (response.status <200 || response.status > 299){
                throw Error("No se pudo obtener el reporte");
            }
            return response.consulta;
        }catch (error){
            throw Error(`Error obteniendo reporte nlp: ${error}`);
        }
    }
}