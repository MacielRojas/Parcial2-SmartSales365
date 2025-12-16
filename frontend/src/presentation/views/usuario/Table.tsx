// src/components/UserTable.tsx
import { useState } from "react";
import type { User } from "../../../domain/entities/Usuario";
// import { RolHook } from "../Rol/Rol_hook";

type TableProps = {
  users: User[];
  editUser: (user: User) => void;
  deleteUser: (user: User) => void;
}

function UserTable({users, editUser, deleteUser}:TableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // puedes hacerlo configurable
  // const rolhook = RolHook();
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Calcular los usuarios visibles en la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // if (rolhook.loading){
  //   return (
  //     <div className="text-center">
  //       <div className="spinner-border" role="status">
  //         <span className="visually-hidden">Loading...</span>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Fecha de Nacimiento</th>
            <th>Rol</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visibleUsers.map((user) => 
            (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.born_date}</td>
              <td>{user.rol.join("-")}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-warning me-2" onClick={()=>editUser(user)}>
                  <i className="bi bi-pencil-square"></i> Editar
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={()=>deleteUser(user)}>
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
        Página {currentPage} de {totalPages} — Mostrando {visibleUsers.length} de{" "}
        {users.length} usuarios
      </div>
    </div>
  );
}

export default UserTable;
