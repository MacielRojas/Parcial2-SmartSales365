import type { Gateway } from "../service/gateway";

export class PagoStripeUseCase{
    api: Gateway;
    constructor(api: Gateway) {
        this.api = api;
    }

    async create(data: any): Promise<any> {
        try{
            const response = await this.api.post(`stripe/create/`, data);
            if (response.status < 200 || response.status > 299 ){throw Error(`Error confirmando pago`)}
            return response.data;
        }catch(error){
            throw Error(`Error creando pago: ${error}`);
        }
    }

    async confirm(id: any): Promise<any> {
        try{
            const response = await this.api.post(`stripe/confirm/`, {'payment_intent_id':id});
            if (response.status < 200 || response.status > 299 ){throw Error(`Error confirmando pago`)}
            return response.data;
        }catch(error){
            throw Error(`Error confirmando pago: ${error}`);
        }
    }

    async cancel(id: any): Promise<any> {
        try{
            const response = await this.api.post(`stripe/cancel/`, {'payment_intent_id':id});
            if (response.status < 200 || response.status > 299 ){throw Error(`Error confirmando pago`)}
            return response.data;
        }catch(error){
            throw Error(`Error cancelando pago: ${error}`);
        }
    }
}