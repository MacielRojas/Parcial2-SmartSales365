import "bootstrap-icons/font/bootstrap-icons.css";
import CheckoutForm from "../../../components/checkoutForm";
import Modal from "../../../components/Modal";
import type { ProductoCarrito } from "./Home";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
// import Loading from "../../../components/loading";

type CartViewProps = {
  productoCarrito: ProductoCarrito[];
  setProductoCarrito: React.Dispatch<React.SetStateAction<ProductoCarrito[]>>;
  total: () => number;
  onClose: () => void;
};

const CartView = ({ onClose, productoCarrito, setProductoCarrito, total, }: CartViewProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  
  const getUserId = () => {

    try {
      // Obtengo el id del usuario
      const access = localStorage.getItem("access");
      if (!access) throw Error("Acceso no autorizado");
      const decode: Record<string, any> = jwtDecode(access);
      if (!decode) throw Error("Acceso no autorizado");
      const userId = decode.user_id;
      return userId;
    } catch (error) {
      console.log(error);
    }
  };

  const onExit = () => {
    setShowModal(false);
    onClose();
    window.location.reload();
  };

  const handleQuantityChange = (id: number, newQty: number) => {

    try {
      if (newQty < 1) return;
      setProductoCarrito((prev) => {
        const updated = prev.map((item) =>
          item.producto.id === id ? { ...item, cantidad: newQty } : item
        );
        localStorage.setItem("productos", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = (id: number) => {

    try {
      setProductoCarrito((prev) => {
        const updated = prev.filter((item) => item.producto.id !== id);
        localStorage.setItem("productos", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleproductos = () => {
    try {
      const productos = productoCarrito.map((item: ProductoCarrito) => {
        return { "producto": item.producto.id, "cantidad": item.cantidad, "descuento": item.descuento };
      });
      return productos;
    } catch (error) {
      console.log(error);
    }
  };

  if (productoCarrito.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center p-5">
          <i className="bi bi-cart-x display-4 text-muted"></i>
          <h5 className="mt-3 text-muted">Tu carrito está vacío</h5>
          <button className="btn btn-outline-success" onClick={() => onClose()}>
            <i className="bi bi-bag"></i> Ir a comprar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-cart-check"></i> Carrito de Compras
        </h5>
        <small>{productoCarrito.length} productos</small>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th></th>
                <th>Producto</th>
                <th className="text-end">Precio</th>
                <th className="text-center">Cantidad</th>
                <th className="text-end">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productoCarrito.map((item) => (
                <tr key={item.producto.id}>
                  {/* <td>
                     <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="img-thumbnail"
                      style={{ width: "80px" }}
                    /> 
                  </td> */}
                  <td>
                    <strong>{item.producto.nombre}</strong>
                  </td>
                  <td className="text-end">
                    ${item.producto.precio}
                  </td>
                  <td className="text-center" style={{ width: "130px" }}>
                    <div className="input-group input-group-sm">
                      {/* <button
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          handleQuantityChange(item.producto.id!, item.cantidad - 1)
                        }
                      >
                        <i className="bi bi-dash"></i>
                      </button> */}
                      <input
                        type="number"
                        min="1"
                        className="form-control text-center"
                        value={item.cantidad}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.producto.id!,
                            Number(e.target.value)
                          )
                        }
                      />
                      {/* <button
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          handleQuantityChange(item.producto.id!, item.cantidad + 1)
                        }
                      >
                        <i className="bi bi-plus"></i>
                      </button> */}
                    </div>
                  </td>
                  <td className="text-end fw-semibold">
                    ${(item.producto.precio * item.cantidad).toFixed(2)}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemove(item.producto.id!)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-light">
              <tr>
                <td colSpan={4} className="text-end fw-bold">
                  Total:
                </td>
                <td className="text-end fw-bold">${total().toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="card-footer bg-light d-flex justify-content-between align-items-center">
        <button
          className="btn btn-outline-danger"
          onClick={() => { setProductoCarrito([]); localStorage.removeItem("productos"); }}
        >
          <i className="bi bi-trash3"></i> Vaciar carrito
        </button>
        {!showModal && (<button className="btn btn-primary px-4" onClick={() => setShowModal(true)}>
          <i className="bi bi-credit-card-2-front"></i> Pagar ${total().toFixed(2)}
        </button>)}
      </div>


      <Modal show={showModal} title="Realizar Pago" onClose={() => onExit()}>
        {showModal && (
          <CheckoutForm
            metadata={{ "items": handleproductos(), }}
            amount={total()}
            userId={getUserId()}
          />
        )}
      </Modal>

    </div>
  );
}

export default CartView;
