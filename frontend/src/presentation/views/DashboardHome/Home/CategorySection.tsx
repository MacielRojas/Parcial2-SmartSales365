import { useState } from "react";
import { CategoriaHook } from "../../Categoria/Categoria_hook";
import Loading from "../../../components/loading";

type CategorySectionProps = {
  setCurrentView: React.Dispatch<React.SetStateAction<{ nombre: string, datos: any }>>
}

function CategorySection({ setCurrentView }: CategorySectionProps) {
  const categoriahook = CategoriaHook();
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 12;

    // 🔹 Cálculo de categorías por página
  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentCategories = categoriahook.items.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(categoriahook.items.length / categoriesPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  if (categoriahook.loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Categorías</h5>
        <small>
          Página {currentPage} de {totalPages}
        </small>
      </div>

      <div className="card-body">
        <div className="row text-center gy-3">
          {currentCategories.map((c, i) => (
            <div key={i} className="col-6 col-md-3 col-lg-2">
              <div className="p-3 border rounded bg-light h-100" onClick={() => setCurrentView({ nombre: "categoryproduct", datos: {"categoria": c} })}>
                {/* Si tienes iconos, descomenta esto 👇 */}
                {/* <i className={`bi ${c.icon || "bi-folder"} fs-2 mb-2 text-primary`}></i> */}
                <h6 className="fw-semibold">{c.nombre}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Controles de paginación */}
      <div className="card-footer bg-light">
        <nav>
          <ul className="pagination justify-content-center mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => goToPage(currentPage - 1)}
              >
                Anterior
              </button>
            </li>

            {Array.from({ length: totalPages }).map((_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => goToPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => goToPage(currentPage + 1)}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default CategorySection;
