export class TimeStamp {
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;

    constructor(created_at: Date | null, updated_at: Date | null, deleted_at: Date | null) {
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.deleted_at = deleted_at;
    }
}