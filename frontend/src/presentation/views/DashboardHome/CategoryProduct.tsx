import { useEffect, useState } from "react";
import type { ProductoEntity } from "../../../domain/entities/Producto_entity";
import Loading from "../../components/loading";
import ProductGrid from "./Home/ProductGrid";
import type { CategoriaEntity } from "../../../domain/entities/Categoria_entity";
import { ProductoHook } from "../Producto/Producto_hook";

type CategoryProductProps = {
    categoria?: CategoriaEntity;
    addToCart: (producto: ProductoEntity) => void;
    setCurrentView: React.Dispatch<React.SetStateAction<{ nombre: string, datos: any }>>
}

export const CategoryProduct = ({ categoria, addToCart, setCurrentView}: CategoryProductProps) => {
    const productohook = ProductoHook();
    const [productos, setProductos] = useState<ProductoEntity[]>([]);

    useEffect(() => {
        if (productohook.items) {
            setProductos(productohook.items);
        }
        if (categoria){
            setProductos(productohook.items.filter((item: ProductoEntity) => item.categoria === categoria.id));
        }
    }, [productohook.items]);
    
    if (productohook.loading) {
        return (
            <div className="min-vh-50 d-flex align-items-center justify-content-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">

            <div className="col-auto">
                  <button className="btn btn-light" onClick={() => setCurrentView({ nombre: "home", datos: null })}>
                    <i className="bi bi-arrow-left"></i>
                  </button>
                </div>
            {/* Header de la categoría */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between flex-column flex-md-row gap-3">
                        {/* Información de la categoría */}
                        <div>
                            <h1 className="h2 mb-1 text-dark fw-bold">{categoria?categoria.nombre:"Productos"}</h1>
                            <p className="text-muted mb-0">
                                {productos.length} producto{productos.length !== 1 ? 's' : ''} disponible{productos.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        
                        {/* Filtros y ordenamiento - placeholder para futuras funcionalidades */}
                        <div className="d-flex gap-2 flex-wrap justify-content-center">
                            <button className="btn btn-outline-secondary btn-sm">
                                <i className="bi bi-filter me-2"></i>
                                Filtrar
                            </button>
                            <button className="btn btn-outline-secondary btn-sm">
                                <i className="bi bi-sort-down me-2"></i>
                                Ordenar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estado cuando no hay productos */}
            {productos.length === 0 && !productohook.loading && (
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center py-5">
                                <i className="bi bi-inbox display-1 text-muted mb-3"></i>
                                <h3 className="h4 text-dark mb-2">No hay productos disponibles</h3>
                                <p className="text-muted mb-0">
                                    No se encontraron productos en esta categoría.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid de productos */}
            {productos.length > 0 && (
                <div className="row">
                    <div className="col-12">
                        <ProductGrid 
                            handleAddToCart={addToCart} 
                            items={productos} 
                            setCurrentView={setCurrentView}
                        />
                    </div>
                </div>
            )}

            {/* Footer informativo */}
            {productos.length > 0 && (
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="text-center">
                            <p className="text-muted small">
                                Mostrando {productos.length} producto{productos.length !== 1 ? 's' : ''} en {categoria?categoria.nombre:"Productos"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};