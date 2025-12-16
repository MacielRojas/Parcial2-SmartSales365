import { TimeStamp } from "../values/Timestamp";

export class UserRolEntity extends TimeStamp {
    id: number | null;
    user: number;
    rol: number;

    constructor(id: number | null, user: number, rol: number, 
        created_at: Date | null = null,
        updated_at: Date | null = null,
        deleted_at: Date | null = null
    ) {
        super(created_at, updated_at, deleted_at);
        this.id = id;
        this.user = user;
        this.rol = rol;
    }
}

