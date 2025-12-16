import { TimeStamp } from "../values/Timestamp";

export class GarantiaEntity extends TimeStamp {
    id: number | null;
    producto: number;
    usuario: number;
    precio: number;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    descripcion: string | null;
    estado: string;

    constructor(id: number | null, producto: number, usuario: number, precio: number, fecha_inicio: string | null, fecha_fin: string | null, descripcion: string | null, estado: string,
        created_at: Date | null = null,
        updated_at: Date | null = null,
        deleted_at: Date | null = null
    ) {
        super(created_at, updated_at, deleted_at);
        this.id = id;
        this.producto = producto;
        this.usuario = usuario;
        this.precio = precio;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.descripcion = descripcion;
        this.estado = estado;
    }
}

