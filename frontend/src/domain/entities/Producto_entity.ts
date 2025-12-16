import { TimeStamp } from "../values/Timestamp";

export class ProductoEntity extends TimeStamp {
    id: number | null;
    nombre: string;
    precio: number;
    stock: number;
    codigo: string;
    marca: string;
    categoria: number;

    constructor(id: number | null, nombre: string, precio: number, stock: number, codigo: string, marca: string, categoria: number,
        created_at: Date | null = null,
        updated_at: Date | null = null,
        deleted_at: Date | null = null,
    ) {
        super(created_at, updated_at, deleted_at);
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.codigo = codigo;
        this.marca = marca;
        this.categoria = categoria;
    }
}

