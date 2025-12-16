import { TimeStamp } from "../values/Timestamp";

export class DescuentoEntity extends TimeStamp {
    id: number | null;
    tipo: string;
    producto: number;
    valor: number;
    fecha_inicio: string | null;
    fecha_fin: string | null;

    constructor(id: number | null, tipo: string, producto: number, valor: number, fecha_inicio: string | null, fecha_fin: string | null,
        created_at: Date | null = null,
        updated_at: Date | null = null,
        deleted_at: Date | null = null
    ) {
        super(created_at, updated_at, deleted_at);
        this.id = id;
        this.tipo = tipo;
        this.producto = producto;
        this.valor = valor;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
    }
}

