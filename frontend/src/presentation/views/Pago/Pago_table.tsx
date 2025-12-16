import { useState } from 'react';
import type { PagoEntity } from '../../../domain/entities/Pago_entity';

type PagoTableProps = {
    Pago: PagoEntity[];
    editItem: (Pago: PagoEntity) => void;
    deleteItem: (Pago: PagoEntity) => void;
}

function PagoTable({ Pago, editItem, deleteItem }: PagoTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const totalPages = Math.ceil(Pago.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = Pago.slice(startIndex, startIndex + itemsPerPage);
  const handlePrev = () => setCurrentPage((prev)=> Math.max(prev-1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  return (
  <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead className="table-dark">
          <tr>
          <th>id</th>
          <th>monto</th>
          <th>moneda</th>
          <th>estado</th>
          <th>carrito</th>
          <th>payment_method_id</th>
          <th>payment_intent</th>
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.monto}</td>
              <td>{item.moneda}</td>
              <td>{item.estado}</td>
              <td>{item.carrito}</td>
              <td>{item.payment_method_id}</td>
              <td>{item.payment_intent}</td>
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
        Página {currentPage} de {totalPages} — Mostrando {visibleItems.length} de {Pago.length} registros
      </div>
   </div>
);
}

export default PagoTable;
