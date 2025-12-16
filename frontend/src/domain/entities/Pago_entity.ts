import { TimeStamp } from "../values/Timestamp";

export class PagoEntity extends TimeStamp {
    id: number | null;
    monto: number;
    moneda: string;
    estado: string;
    carrito: number;
    payment_method_id: string;
    payment_intent: string;

    constructor(id: number | null, monto: number, moneda: string, estado: string, carrito: number, payment_method_id: string, payment_intent: string,
        created_at: Date | null = null,
        updated_at: Date | null = null,
        deleted_at: Date | null = null
    ) {
        super(created_at, updated_at, deleted_at);
        this.id = id;
        this.monto = monto;
        this.moneda = moneda;
        this.estado = estado;
        this.carrito = carrito;
        this.payment_method_id = payment_method_id;
        this.payment_intent = payment_intent;
    }
}

