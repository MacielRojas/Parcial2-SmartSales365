import { useState, useEffect } from 'react';
import Topbar from './components/topbar';
import Sidebar, { type SidebarSection } from './components/sidebar';
import MainContent from './components/maincontent';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  // Configuración del Sidebar (Personalizable)
  const sidebarSections: SidebarSection[] = [
    {
      id: 1,
      title: 'Principal',
      options: [
        { id: 1, label: 'Dashboard', icon: 'speedometer2', path: '/dashboard' },
        { id: 2, label: 'Estadísticas', icon: 'graph-up', path: '/estadisticas' },
        { id: 3, label: 'Reportes', icon: 'file-earmark-text', path: '/reportes' },
        { id: 30, label: 'Bitacora', icon: 'book', path: '/bitacora' },
        { id: 31, label: 'Historial Pagos', icon: 'cash', path: '/historialpagos' },
      ],
    },
    {
      id: 2,
      title: 'Gestión',
      options: [
        { id: 10, label: 'Usuarios', icon: 'people', path: '/usuarios' },
        { id: 11, label: 'Productos', icon: 'box', path: '/productos' },
        { id: 12, label: 'Ventas', icon: 'cash', path: '/ventas' },
        { id: 13, label: 'Categorías', icon: 'tag', path: '/categorias' },
        { id: 14, label: 'Carritos', icon: 'cart', path: '/carritos' },
        { id: 15, label: 'Mantenimientos', icon: 'cart-check', path: '/mantenimientos' },
        { id: 16, label: 'Facturas', icon: 'receipt', path: '/facturas' },
        { id: 17, label: 'Pagos', icon: 'credit-card', path: '/pagos' },
        { id: 18, label: 'DetallesCarrito', icon: 'truck', path: '/detallescarrito'},
      ],
    },
    {
      id: 3,
      title: 'Configuración',
      options: [
        { id: 4, label: 'Ajustes', icon: 'gear', path: '/settings' },
        { id: 5, label: 'Seguridad', icon: 'shield-lock', path: '/security' },
        { id: 6, label: 'Ayuda', icon: 'question-circle', path: '/help' },
      ],
    },
  ];

  // Toggle del sidebar
  const handleSidebarToggle = () => setShowSidebar(!showSidebar);

  // Navegación
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    handleNavigate('/dashboard');
  }, []);

  return (
    <div>
      {/* === Topbar === */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1040, // superior al sidebar
        }}
      >
        <Topbar
          onLogin={() => handleNavigate('/login')}
          onRegister={() => handleNavigate('/register')}
          onProfile={() => handleNavigate('/profile')}
          onHome={() => handleNavigate('/dashboard')}
          onToggleSidebar={handleSidebarToggle}
        />
      </div>

      {/* === Contenido general === */}
      <div className="d-flex bg-light">
        {/* Sidebar (solo visible si está activo) */}
        {showSidebar && (
          <Sidebar sections={sidebarSections} onNavigate={handleNavigate} />
        )}

        {/* Contenido principal */}
        <div
          className="bg-light p-3"
          style={{
            marginLeft: showSidebar ? '250px' : '0',
            marginTop: '56px', // altura del topbar
            width: showSidebar ? 'calc(100% - 250px)' : '100%',
            minHeight: 'calc(100vh - 56px)',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <MainContent />
        </div>
      </div>

      {/* Bootstrap Icons */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
      />
    </div>
  );
};

export default Dashboard;
