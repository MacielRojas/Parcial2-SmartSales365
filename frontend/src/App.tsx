import { Route, BrowserRouter, Routes,} from 'react-router-dom';
import Dashboard from './presentation/dashboard';
import Login from './presentation/views/login';
import Usuarios from './presentation/views/usuario/usuarios';
import Categoria from './presentation/views/Categoria/Categoria_view';
import Venta from './presentation/views/Venta/Venta_view';
import Pago from './presentation/views/Pago/Pago_view';
import Producto from './presentation/views/Producto/Producto_view';
import Rol from './presentation/views/Rol/Rol_view';
import Permiso from './presentation/views/Permiso/Permiso_view';
import Mantenimiento from './presentation/views/Mantenimiento/Mantenimiento_view';
import Garantia from './presentation/views/Garantia/Garantia_view';
import Descuento from './presentation/views/Descuento/Descuento_view';
import Carrito from './presentation/views/Carrito/Carrito_view';
import DetalleCarrito from './presentation/views/DetalleCarrito/DetalleCarrito_view';
import Factura from './presentation/views/Factura/Factura_view';
import Galeria from './presentation/views/Galeria/Galeria_view';
// import { useEffect, useState } from 'react';
import RegisterView from './presentation/views/Register';
import ProfileView from './presentation/views/Profile/Perfil';
import Reporte from './presentation/views/Reporte/Reporte';
import BitacoraView from './presentation/views/Bitacora/BitacoraView';
import { StadisticView } from './presentation/views/Stadistic/Stadistic';
import { HomeView } from './presentation/views/DashboardHome/Home/HomeView';
import { HistorialPagos } from './presentation/views/Pago/PagoHistorial';
function App() {
  // const [isAdmin, setIsAdmin] = useState(false);

  // useEffect(() => {
  //   const rol = localStorage.getItem('rol');
  //   if (rol==='Administrador') {
  //     // setIsAdmin(true);
  //   }
  // }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
        {/* Rutas hijas de la ruta principal que se renderizaran en outlet */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterView />} />
        <Route path="bitacora" element={<BitacoraView />} />
        <Route path="estadisticas" element={<StadisticView />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="categorias" element={<Categoria />} />
        <Route path="dashboard" element={<HomeView />} />
        <Route path="ventas" element={<Venta />} />
        <Route path="pagos" element={<Pago />} />
        <Route path="historialpagos" element={<HistorialPagos />} />
        <Route path="productos" element={<Producto/>}/>
        <Route path="roles" element={<Rol/>}/>
        <Route path="permisos" element={<Permiso/>}/>
        <Route path="mantenimientos" element={<Mantenimiento/>}/>
        <Route path="garantias" element={<Garantia/>}/>
        <Route path="descuentos" element={<Descuento/>}/>
        <Route path="carritos" element={<Carrito/>}/>
        <Route path="detallescarrito" element={<DetalleCarrito/>} />
        <Route path="facturas" element={<Factura/>}/>
        <Route path="galerias" element={<Galeria/>}/>
        <Route path="profile" element={<ProfileView />} />
        <Route path="reportes" element={<Reporte/>} />

        </Route>
        
        <Route path="*" element={<h1>404 not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
