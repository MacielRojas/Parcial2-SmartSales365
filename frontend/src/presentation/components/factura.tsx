import { useEffect, useState } from "react";
import { CarritoUseCase } from "../../application/usecases/Carrito_uc";
import { APIGateway } from "../../infraestructure/services/APIGateway";
import { DetalleCarritoUseCase } from "../../application/usecases/DetalleCarrito_uc";
import { ProductoUseCase } from "../../application/usecases/Producto_uc";
import Loading from "./loading";

type FacturaDetailsState = {
    company: string;
    nit: string;
    products: { nombre: string; cantidad: number; precio: number }[];
    subtotal: number;
    tax: number;
    total: number;
};

export const FacturaDetails = ({ carrito_id, currency = "bob", }: { carrito_id: string; currency?: string; }) => {
    const carrito_uc = new CarritoUseCase(new APIGateway());
    const detalle_carrito_uc = new DetalleCarritoUseCase(new APIGateway());
    const producto_uc = new ProductoUseCase(new APIGateway());

    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<FacturaDetailsState>({
        company: "SmartSales-365",
        nit: "123456789-0",
        products: [],
        subtotal: 0,
        tax: 0,
        total: 0
    });

    const handleCarrito = async () => {
        try {
            setLoading(true);
            const carrito = await carrito_uc.get(carrito_id);
            if (!carrito) throw Error(`Error obteniendo Carrito`);
            const detalle_carrito = await detalle_carrito_uc.getbycartid(`${carrito[0].id}`);
            if (!detalle_carrito) throw Error(`Error obteniendo DetalleCarrito`);
            const productos = await Promise.all(detalle_carrito.map(async (item: any) => {
                const producto = await producto_uc.get(item.producto);
                if (!producto) throw Error(`Error obteniendo Producto`);
                return {
                    nombre: producto[0].nombre,
                    cantidad: item.cantidad,
                    precio: producto[0].precio
                };
            }));
            const subtotal = productos.reduce((total, item) => total + item.precio * item.cantidad, 0);
            const tax = subtotal * 0.05;
            const total = subtotal + tax;
            setState({
                company: "SmartSales-365",
                nit: "123456789-0",
                products: productos,
                subtotal,
                tax,
                total
            });
        } catch (error) {
            console.error(error);
        }finally {
            setLoading(false);
        }
    };

    useEffect(()=>{
        handleCarrito();
    },[]);


//   // Datos de ejemplo - puedes pasar estos como props
// const state = {
//     company: "Mi Tienda Online",
//     nit: "123456789-0",
//     products: [
//       { name: "Laptop Gaming", quantity: 1, price: amount * 0.6 },
//       { name: "Mouse Inalámbrico", quantity: 1, price: amount * 0.4 }
//     ],
//     subtotal: amount * 0.95,
//     tax: amount * 0.05,
//     total: amount
//   };
    if (loading){
        return (
            <div>
                <Loading />
            </div>
        );
    }

  return (

    <div className="text-center mt-4" style={{ maxWidth: 500, margin: "0 auto" }}>
      <div className="border-2 border-gray-300 rounded-lg p-6 bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-600">¡Pago Exitoso!</h2>
        
        {/* Factura */}
        <div className="text-left mb-6">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">Factura de Compra</h3>
          
          {/* Información de la empresa */}
          <div className="mb-4">
            <p className="font-semibold">Empresa: {state.company}</p>
            <p className="font-semibold">NIT: {state.nit}</p>
            <p className="text-sm text-gray-600">Fecha: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Lista de productos */}
          <div className="mb-4">
            {/* headers */}
            <div className="flex justify-between mb-2">
              <span className="font-bold">Producto</span>
              <span className="font-bold">Cantidad</span>
              <span className="font-bold">Precio</span>
            </div>
            {state.products.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>{item.nombre}</span>
                <span>{item.cantidad}</span>
                <span>${item.precio.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="border-t pt-3">
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>${state.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>IVA (5%):</span>
              <span>${state.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
              <span>TOTAL:</span>
              <span className="text-green-600">${state.total} {currency.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
          <p className="text-green-800">{message}</p>
        </div> */}
      </div>
    </div>
  );
}