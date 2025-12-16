import { ProductoEntity } from '../../../domain/entities/Producto_entity';

interface ProductoDetailViewProps {
  producto: ProductoEntity;
  addToCart: (producto: ProductoEntity) => void;
  setCurrentView: React.Dispatch<React.SetStateAction<{ nombre: string, datos: any }>>
}

export const ProductoDetailView: React.FC<ProductoDetailViewProps> = ({ producto, addToCart, setCurrentView }) => {
  const handleAddToCart = () => {
    addToCart(producto);
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          {/* Header */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-auto">
                  <button className="btn btn-light" onClick={() => setCurrentView({ nombre: "home", datos: null })}>
                    <i className="bi bi-arrow-left"></i>
                  </button>
                </div>
                <div className="col">
                  <h1 className="h3 mb-2 text-dark fw-bold">{producto.nombre}</h1>
                  <p className="text-muted mb-0">Código: {producto.codigo}</p>
                </div>
                <div className="col-auto">
                  <span className="badge bg-primary fs-6">ID: {producto.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="card-title text-dark mb-4 fw-semibold">Información del Producto</h5>
              
              <div className="row g-3">
                {/* Precio */}
                <div className="col-12 col-sm-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded-3">
                    <div className="flex-grow-1">
                      <p className="text-muted small mb-1">Precio</p>
                      <h4 className="text-success mb-0 fw-bold">
                        ${producto.precio.toLocaleString('es-ES')}
                      </h4>
                    </div>
                    <div className="flex-shrink-0 ms-3">
                      <i className="bi bi-currency-dollar fs-4 text-success"></i>
                    </div>
                  </div>
                </div>

                {/* Stock */}
                <div className="col-12 col-sm-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded-3">
                    <div className="flex-grow-1">
                      <p className="text-muted small mb-1">Stock Disponible</p>
                      <h4 className={`mb-0 fw-bold ${producto.stock > 0 ? 'text-primary' : 'text-danger'}`}>
                        {producto.stock} unidades
                      </h4>
                    </div>
                    <div className="flex-shrink-0 ms-3">
                      <i className={`bi ${producto.stock > 0 ? 'bi-box-seam text-primary' : 'bi-box text-danger'} fs-4`}></i>
                    </div>
                  </div>
                </div>

                {/* Marca */}
                <div className="col-12 col-sm-6">
                  <div className="p-3 border rounded-3">
                    <p className="text-muted small mb-1">Marca</p>
                    <h6 className="mb-0 text-dark fw-semibold">{producto.marca}</h6>
                  </div>
                </div>

                {/* Categoría */}
                <div className="col-12 col-sm-6">
                  <div className="p-3 border rounded-3">
                    <p className="text-muted small mb-1">Categoría</p>
                    <h6 className="mb-0 text-dark fw-semibold">#{producto.categoria}</h6>
                  </div>
                </div>
              </div>

              {/* Botón Agregar al Carrito */}
              <div className="row mt-4">
                <div className="col-12">
                  <button 
                    className={`btn w-100 py-3 fw-semibold ${
                      producto.stock > 0 
                        ? 'btn-success' 
                        : 'btn-secondary disabled'
                    }`}
                    onClick={handleAddToCart}
                    disabled={producto.stock <= 0}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    {producto.stock > 0 
                      ? `Agregar al Carrito - $${producto.precio.toLocaleString('es-ES')}`
                      : 'Sin Stock Disponible'
                    }
                  </button>
                  {producto.stock > 0 && (
                    <p className="text-muted small text-center mt-2 mb-0">
                      {producto.stock} unidades disponibles
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h6 className="text-dark mb-3 fw-semibold">Información de Registro</h6>
              <div className="row g-3">
                {producto.created_at && (
                  <div className="col-12 col-md-4">
                    <div className="text-center p-3 border rounded-3">
                      <p className="text-muted small mb-1">Creado</p>
                      <p className="mb-0 text-dark small fw-medium">
                        {new Date(producto.created_at).toLocaleDateString('es-ES')}
                      </p>
                      <p className="mb-0 text-muted small">
                        {new Date(producto.created_at).toLocaleTimeString('es-ES')}
                      </p>
                    </div>
                  </div>
                )}
                
                {producto.updated_at && (
                  <div className="col-12 col-md-4">
                    <div className="text-center p-3 border rounded-3">
                      <p className="text-muted small mb-1">Actualizado</p>
                      <p className="mb-0 text-dark small fw-medium">
                        {new Date(producto.updated_at).toLocaleDateString('es-ES')}
                      </p>
                      <p className="mb-0 text-muted small">
                        {new Date(producto.updated_at).toLocaleTimeString('es-ES')}
                      </p>
                    </div>
                  </div>
                )}
                
                {producto.deleted_at && (
                  <div className="col-12 col-md-4">
                    <div className="text-center p-3 border rounded-3 bg-light">
                      <p className="text-danger small mb-1">Eliminado</p>
                      <p className="mb-0 text-dark small fw-medium">
                        {new Date(producto.deleted_at).toLocaleDateString('es-ES')}
                      </p>
                      <p className="mb-0 text-muted small">
                        {new Date(producto.deleted_at).toLocaleTimeString('es-ES')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};