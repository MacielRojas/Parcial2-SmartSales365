import { TimeStamp } from "../values/Timestamp";

export class BitacoraEntity extends TimeStamp{
    id: number | null;
    usuario: number;
    accion: string;
    ipv4: string;
    nivel: string;

    constructor(
        id: number | null, 
        usuario: number, 
        accion: string, 
        ipv4: string, 
        nivel: string,
        created_at: Date | null = null,
        updated_at: Date | null = null,
        deleted_at: Date | null = null,
    ) {
        super(created_at, updated_at, deleted_at);
        this.id = id;
        this.usuario = usuario;
        this.accion = accion;
        this.ipv4 = ipv4;
        this.nivel = nivel;
    }
}

