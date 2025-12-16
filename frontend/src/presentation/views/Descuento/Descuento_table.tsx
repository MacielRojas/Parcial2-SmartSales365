import { useState } from 'react';
import type { DescuentoEntity } from '../../../domain/entities/Descuento_entity';

type DescuentoTableProps = {
    Descuento: DescuentoEntity[];
    editItem: (Descuento: DescuentoEntity) => void;
    deleteItem: (Descuento: DescuentoEntity) => void;
}

function DescuentoTable({ Descuento, editItem, deleteItem }: DescuentoTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const totalPages = Math.ceil(Descuento.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = Descuento.slice(startIndex, startIndex + itemsPerPage);
  const handlePrev = () => setCurrentPage((prev)=> Math.max(prev-1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  return (
  <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead className="table-dark">
          <tr>
          <th>id</th>
          <th>tipo</th>
          <th>producto</th>
          <th>valor</th>
          <th>fecha_inicio</th>
          <th>fecha_fin</th>
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.tipo}</td>
              <td>{item.producto}</td>
              <td>{item.valor}</td>
              <td>{item.fecha_inicio}</td>
              <td>{item.fecha_fin}</td>
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
        Página {currentPage} de {totalPages} — Mostrando {visibleItems.length} de {Descuento.length} registros
      </div>
   </div>
);
}

export default DescuentoTable;
