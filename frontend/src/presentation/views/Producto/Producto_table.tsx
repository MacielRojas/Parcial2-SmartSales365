import { useState } from 'react';
import type { ProductoEntity } from '../../../domain/entities/Producto_entity';
import { CategoriaHook } from '../Categoria/Categoria_hook';

type ProductoTableProps = {
    Producto: ProductoEntity[];
    editItem: (Producto: ProductoEntity) => void;
    deleteItem: (Producto: ProductoEntity) => void;
}

function ProductoTable({ Producto, editItem, deleteItem }: ProductoTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const categoriahook = CategoriaHook();
  const totalPages = Math.ceil(Producto.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = Producto.slice(startIndex, startIndex + itemsPerPage);
  const handlePrev = () => setCurrentPage((prev)=> Math.max(prev-1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (categoriahook.loading){
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
  <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead className="table-dark">
          <tr>
          <th>id</th>
          <th>nombre</th>
          <th>precio</th>
          <th>stock</th>
          <th>codigo</th>
          <th>marca</th>
          <th>categoria</th>
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((item) => {
            let categoria = categoriahook.items.find((c) => c.id === item.categoria); 
            return(
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.precio}</td>
              <td>{item.stock}</td>
              <td>{item.codigo}</td>
              <td>{item.marca}</td>
              <td>{categoria?.nombre}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-warning me-2" onClick={() => editItem(item)}>
                  <i className="bi bi-pencil-square"></i> Editar
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteItem(item)}>
                  <i className="bi bi-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          );})}
        </tbody>
      </table>
      
      {/* 🔹 Paginación */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={handlePrev}>
              Anterior
            </button>
          </li>
      
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
      
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={handleNext}>
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
      
      {/* 🔹 Info de paginación */}
      <div className="text-center text-muted small mt-2">
        Página {currentPage} de {totalPages} — Mostrando {visibleItems.length} de {Producto.length} registros
      </div>
   </div>
);
}

export default ProductoTable;
