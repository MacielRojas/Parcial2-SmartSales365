import { TimeStamp } from "../values/Timestamp";

export class DetalleCarritoEntity extends TimeStamp {
    id: number | null;
    carrito: number;
    producto: number;
    cantidad: number;
    descuento: number | null;

    constructor(id: number | null, carrito: number, producto: number, cantidad: number, descuento: number | null,
        created_at: Date | null = null,
        updated_at: Date | null = null,
        deleted_at: Date | null = null
    ) {
        super(created_at, updated_at, deleted_at);
        this.id = id;
        this.carrito = carrito;
        this.producto = producto;
        this.cantidad = cantidad;
        this.descuento = descuento;
    }
}

