import { TimeStamp } from "../values/Timestamp";

export class FacturaEntity extends TimeStamp {
    id: number | null;
    venta: number;
    fecha_expendida: string | null;
    nit: string | null;

    constructor(id: number | null, venta: number, fecha_expendida: string | null, nit: string | null,
        created_at: Date | null = null,
        updated_at: Date | null = null,
        deleted_at: Date | null = null
    ) {
        super(created_at, updated_at, deleted_at);
        this.id = id;
        this.venta = venta;
        this.fecha_expendida = fecha_expendida;
        this.nit = nit;
    }
}

