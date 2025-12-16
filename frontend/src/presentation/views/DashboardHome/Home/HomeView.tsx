import { useEffect, useState } from "react"
import Home, { type ProductoCarrito } from "./Home";
import { ProductoDetailView } from "../ProductoDetail";
import { CategoryProduct } from "../CategoryProduct";
import { ProductoEntity } from "../../../../domain/entities/Producto_entity";
import { showToast } from "../../../components/toastcontainer";
import Loading from "../../../components/loading";

export const HomeView = () => {
    // Selecciona las vistas que se mostraran en /dashboard
    const [currentView, setCurrentView] = useState<{ nombre: string, datos: any }>({ nombre: "home", datos: null });
    // Carrito con productos agregados
    const [productoCarrito, setProductoCarrito] = useState<ProductoCarrito[]>([]);
    // loading
    const [loading, setLoading] = useState<boolean>(false);
    // cartItemsCount
    const [cartItemsCount, setCartItemsCount] = useState<number>(0);

    // Funcion para agregar productos al carrito
    const handleAddToCart = (producto: ProductoEntity) => {
        setLoading(true);
        try {
            const access = localStorage.getItem("access");
            if (!access) {
                showToast("Debes iniciar sesión primero", "error");
                return;
            }
            const nuevoCarrito = [...productoCarrito];
            // Verificar si el producto ya está en el carrito
            const productoEnCarrito = nuevoCarrito.find((item) => item.producto.id === producto.id);
            if (productoEnCarrito) {
                // Si el producto ya está en el carrito, aumentar la cantidad
                productoEnCarrito.cantidad += 1;
            } else {
                // Si el producto no está en el carrito, agregarlo
                nuevoCarrito.push({ producto, cantidad: 1, descuento: null });
                setCartItemsCount(cartItemsCount + 1);
            }
            localStorage.setItem("productos", JSON.stringify(nuevoCarrito));
            setProductoCarrito(nuevoCarrito);
            showToast("Producto agregado al carrito", "success");
        } catch (error) {
            throw Error(`Error agregando producto al carrito: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const mapearCarrito = () => {
        setLoading(true);
        try {
            // productos del carrito contiene productoEntity, cantidad, descuento
            let items = localStorage.getItem("productos");
            if (!items) {
                setProductoCarrito([]);
                return;
            }

            const productos: Record<string, any>[] = JSON.parse(items);
            if (productos.length === 0) {
                setProductoCarrito([]);
                return;
            }

            const productocarrito = productos.map((item) => {
                const productoentidad = new ProductoEntity(
                    item.producto.id,
                    item.producto.nombre,
                    item.producto.precio,
                    item.producto.stock,
                    item.producto.codigo,
                    item.producto.marca,
                    item.producto.categoria,
                );
                return {
                    producto: productoentidad,
                    cantidad: item.cantidad || 1,
                    descuento: null
                };
            });

            setProductoCarrito(productocarrito);
            setCartItemsCount(productocarrito.length);
        } catch (error) {
            setProductoCarrito([]);
            setCartItemsCount(0);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        mapearCarrito();
    }, []);

    if (loading) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    return (
        <div className="app-container">
            {currentView.nombre === "categoryproduct" &&
                <CategoryProduct
                    categoria={currentView.datos ? currentView.datos.categoria : null}
                    addToCart={handleAddToCart}
                    setCurrentView={setCurrentView}
                />}
            {currentView.nombre === "detailproduct" &&
                <ProductoDetailView
                    producto={currentView.datos ? currentView.datos.producto : null}
                    addToCart={handleAddToCart}
                    setCurrentView={setCurrentView}
                />}
            {currentView.nombre === "home" &&
                <Home
                    // loading={loading}
                    handleAddToCart={handleAddToCart}
                    productoCarrito={productoCarrito}
                    setProductoCarrito={setProductoCarrito}
                    setCurrentView={setCurrentView}
                    cartItemsCount={cartItemsCount}
                />}
        </div>
    );

}