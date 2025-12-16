import { useState, useEffect } from "react";
import { ProductoEntity } from "../../../../domain/entities/Producto_entity";
// import Loading from "../../../components/loading";

type ProductGridProps = {
  handleAddToCart: (producto: ProductoEntity) => void;
  items: ProductoEntity[],
  setCurrentView: React.Dispatch<React.SetStateAction<{ nombre: string, datos: any }>>
}

function ProductGrid({ handleAddToCart, items, setCurrentView }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Ajustar productos por página según el tamaño de pantalla
  const getProductsPerPage = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 576) return 8;  // Móviles: 2 columnas × 4 filas
      if (width < 768) return 12; // Tablets pequeñas: 3 columnas × 4 filas
      if (width < 992) return 16; // Tablets: 4 columnas × 4 filas
    }
    return 24; // Escritorio: 6 columnas × 4 filas
  };

  const [productsPerPage, setProductsPerPage] = useState(getProductsPerPage());

  // Actualizar productos por página cuando cambie el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setProductsPerPage(getProductsPerPage());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcular índices de paginación
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = items.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(items.length / productsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Generar números de página para paginación (máximo 5 en móviles)
  const getPageNumbers = () => {
    const maxVisiblePages = window.innerWidth < 576 ? 5 : 7;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // if (loading) {
  //   return (
  //     <Loading />
  //   );
  // }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-primary text-white d-flex flex-column flex-md-row justify-content-between align-items-center py-3">
        <h5 className="mb-2 mb-md-0 text-center text-md-start">Productos Destacados</h5>
        <small className="text-center text-md-end">
          Página {currentPage} de {totalPages}
        </small>
      </div>

      <div className="card-body p-2 p-sm-3">
        <div className="row g-2 g-sm-3 g-md-4">
          {currentProducts.map((p) => {
            if (p.stock > 0){
            return (
            <div key={p.id} className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-2">
              <div className="card h-100 shadow-sm product-card">
                <div className="card-img-container position-relative">
                  <img
                    src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(
                      p.nombre
                    )}`}
                    className="card-img-top p-2"
                    alt={p.nombre}
                    loading="lazy"
                  />
                </div>
                <div className="card-body p-2 d-flex flex-column">
                  <h6 className="fw-semibold card-title text-truncate" title={p.nombre} 
                  onClick={()=> setCurrentView({ nombre: "detailproduct", datos: {"producto": p} })}>
                    {p.nombre}
                  </h6>
                  <p className="text-muted mb-2 fw-bold">${p.precio.toFixed(2)}</p>
                  <button
                    className="btn btn-success btn-sm mt-auto"
                    onClick={() => handleAddToCart(p)}
                  >
                    <i className="bi bi-cart-plus me-1"></i> 
                    <span className="d-none d-sm-inline">Agregar</span>
                  </button>
                </div>
              </div>
            </div>
          );}
          return;})}
        </div>
      </div>

      {/* 🔹 Controles de paginación responsive */}
      <div className="card-footer bg-light py-2 py-sm-3">
        <nav aria-label="Navegación de productos">
          <ul className="pagination justify-content-center mb-0 flex-wrap">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link px-2 px-sm-3"
                onClick={() => goToPage(currentPage - 1)}
                aria-label="Página anterior"
              >
                <span className="d-none d-sm-inline">Anterior</span>
                <i className="bi bi-chevron-left d-sm-none"></i>
              </button>
            </li>

            {/* Mostrar primera página si no está visible */}
            {getPageNumbers()[0] > 1 && (
              <>
                <li className="page-item">
                  <button className="page-link px-2 px-sm-3" onClick={() => goToPage(1)}>
                    1
                  </button>
                </li>
                {getPageNumbers()[0] > 2 && (
                  <li className="page-item disabled">
                    <span className="page-link px-1 px-sm-2">...</span>
                  </li>
                )}
              </>
            )}

            {/* Números de página */}
            {getPageNumbers().map((pageNum) => (
              <li
                key={pageNum}
                className={`page-item ${currentPage === pageNum ? "active" : ""}`}
              >
                <button 
                  className="page-link px-2 px-sm-3" 
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              </li>
            ))}

            {/* Mostrar última página si no está visible */}
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
              <>
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                  <li className="page-item disabled">
                    <span className="page-link px-1 px-sm-2">...</span>
                  </li>
                )}
                <li className="page-item">
                  <button 
                    className="page-link px-2 px-sm-3" 
                    onClick={() => goToPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                </li>
              </>
            )}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link px-2 px-sm-3"
                onClick={() => goToPage(currentPage + 1)}
                aria-label="Página siguiente"
              >
                <span className="d-none d-sm-inline">Siguiente</span>
                <i className="bi bi-chevron-right d-sm-none"></i>
              </button>
            </li>
          </ul>
        </nav>
        
        {/* Información de paginación para móviles */}
        <div className="text-center mt-2 d-block d-md-none">
          <small className="text-muted">
            Mostrando {currentProducts.length} de {items.length} productos
          </small>
        </div>
      </div>
    </div>
  );
}

export default ProductGrid;
