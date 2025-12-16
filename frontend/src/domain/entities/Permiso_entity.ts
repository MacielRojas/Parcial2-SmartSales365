import { TimeStamp } from "../values/Timestamp";

export class PermisoEntity extends TimeStamp {
    id: number | null;
    nombre: string;
    descripcion: string | null;

    constructor(id: number | null, nombre: string, descripcion: string | null,
        created_at: Date | null = null,
        updated_at: Date | null = null,
        deleted_at: Date | null = null,
    ) {
        super(created_at, updated_at, deleted_at);
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
}

