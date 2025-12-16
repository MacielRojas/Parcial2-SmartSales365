import { useState } from 'react';
import type { CarritoEntity } from '../../../domain/entities/Carrito_entity';
import { UserHook } from '../usuario/UsuarioHook';

type CarritoTableProps = {
    Carrito: CarritoEntity[];
    editItem: (Carrito: CarritoEntity) => void;
    deleteItem: (Carrito: CarritoEntity) => void;
}

function CarritoTable({ Carrito, editItem, deleteItem }: CarritoTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const usuariohook = UserHook();
  const totalPages = Math.ceil(Carrito.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = Carrito.slice(startIndex, startIndex + itemsPerPage);
  const handlePrev = () => setCurrentPage((prev)=> Math.max(prev-1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (usuariohook.loading){
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
          <th>usuario</th>
          <th>total</th>
          <th>descuento</th>
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{usuariohook.items.find(user => user.id === item.usuario)?.email}</td>
              <td>{item.total}</td>
              <td>{item.descuento}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-warning me-2" onClick={() => editItem(item)}>
                  <i className="bi bi-pencil-square"></i> Editar
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteItem(item)}>
                  <i className="bi bi-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          ))}
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
        Página {currentPage} de {totalPages} — Mostrando {visibleItems.length} de {Carrito.length} registros
      </div>
   </div>
);
}

export default CarritoTable;
