import { TimeStamp } from "../values/Timestamp";

export class MantenimientoEntity extends TimeStamp {
    id: number | null;
    producto: number;
    precio: number;
    fecha_programada: string | null;
    estado: string;
    usuario: number;

    constructor(id: number | null, producto: number, precio: number, fecha_programada: string | null, estado: string, usuario: number,
        created_at: Date | null = null,
        updated_at: Date | null = null,
        deleted_at: Date | null = null
    ) {
        super(created_at, updated_at, deleted_at);
        this.id = id;
        this.producto = producto;
        this.precio = precio;
        this.fecha_programada = fecha_programada;
        this.estado = estado;
        this.usuario = usuario;
    }
}

