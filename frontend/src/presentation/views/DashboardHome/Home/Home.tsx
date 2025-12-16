import HeroBanner from './HeroBanner';
import CategorySection from './CategorySection';
import ProductGrid from './ProductGrid';
// import CartSummary from './CartSummary';
import QuickLinks from './QuickLinks';
import { ProductoEntity } from '../../../../domain/entities/Producto_entity';
import { useState } from 'react';
import Modal from '../../../components/Modal';
import CartView from './CartView';
import { ProductoHook } from '../../Producto/Producto_hook';
import Loading from '../../../components/loading';
// import Loading from '../../../components/loading';

export interface ProductoCarrito {
  producto: ProductoEntity;
  cantidad: number;
  descuento: number | null;
}

type HomeProps = {
  handleAddToCart: (producto: ProductoEntity) => void;
  setProductoCarrito: React.Dispatch<React.SetStateAction<ProductoCarrito[]>>;
  productoCarrito: ProductoCarrito[];
  // loading: boolean;
  cartItemsCount: number;
  setCurrentView: React.Dispatch<React.SetStateAction<{ nombre: string, datos: any }>>
};

const Home = ({ 
  handleAddToCart,
  productoCarrito,
  setProductoCarrito,
  setCurrentView,
  // loading,
  cartItemsCount,
}: HomeProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const productohook = ProductoHook();
  
  // Funcion para calcular el total
  const total = () => {
    try {
      let total = 0;
      productoCarrito.forEach((item) => {
        total += item.producto.precio * item.cantidad;
      });
      return total;
    } catch (error) {
      throw Error(`Error calculando total: ${error}`);
    }
  };

  if (productohook.loading) {
    return (
      <div className="min-vh-50 d-flex align-items-center justify-content-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light px-0">
      {/* 🔹 Botón flotante de carrito - Responsive */}
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-primary position-fixed rounded-circle shadow d-flex align-items-center justify-content-center"
        style={{
          zIndex: 1050,
          width: "3rem",
          height: "3rem",
          bottom: "1.5rem",
          right: "1rem",
          fontSize: "1.2rem"
        }}
        title="Ver carrito"
      >
        <i className="bi bi-cart4"></i>
        {cartItemsCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.6rem", minWidth: "1.2rem", height: "1.2rem" }}
          >
            {cartItemsCount > 99 ? '99+' : cartItemsCount}
          </span>
        )}
      </button>

      {/* Banner principal */}
      <section className="mb-4 mb-md-5">
        <HeroBanner setCurrentView={setCurrentView} />
      </section>

      {/* Contenido principal con padding lateral en móviles */}
      <div className="container px-3 px-md-4 px-lg-5">
        {/* Categorías */}
        <section className="mb-4 mb-md-5">
          <CategorySection setCurrentView={setCurrentView} />
        </section>

        {/* Productos */}
        <section className="mb-4 mb-md-5">
          <ProductGrid handleAddToCart={handleAddToCart} items={productohook.items} setCurrentView={setCurrentView} />
        </section>

        {/* Resumen del carrito */}
        {/* <section className="mb-4 mb-md-5">
          <CartSummary />
        </section> */}

        {/* Accesos rápidos */}
        <section className="mb-4 mb-md-5">
          <QuickLinks />
        </section>
      </div>
      <Modal show={showModal} title="Carrito de compras" onClose={() => setShowModal(false)}>
        <CartView
          productoCarrito={productoCarrito}
          setProductoCarrito={setProductoCarrito}
          total={total}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}

export default Home;
