import { TimeStamp } from "../values/Timestamp";

export class CarritoEntity extends TimeStamp{
    id: number | null;
    usuario: number;
    total: number;
    descuento: number | null;

    constructor(id: number | null, usuario: number, total: number, descuento: number | null, 
        created_at: Date | null = null,
        updated_at: Date | null = null,
        deleted_at: Date | null = null,
    ) {
        super(created_at, updated_at, deleted_at);
        this.id = id;
        this.usuario = usuario;
        this.total = total;
        this.descuento = descuento;
    }
}

