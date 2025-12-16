import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
  onLogin: () => void;
  onRegister: () => void;
  onProfile: () => void;
  onHome: () => void;
  onToggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  onLogin,
  onRegister,
  onProfile,
  onHome,
  onToggleSidebar,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e && e.key !== "Enter") return;
    console.log("Buscando:", searchQuery);
  };


  const navigate = useNavigate();

  const authenticated = () => {
    try {
      const access = localStorage.getItem("access");
      if (!access) throw Error("Acceso no autorizado");
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    authenticated();
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container-fluid">
        <div className="d-flex align-items-center w-100">
          {/* Botón toggle sidebar */}
          <button
            className="btn btn-outline-light me-2 flex-shrink-0"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <i className="bi bi-list"></i>
          </button>

          {/* Botón Home */}
          <button
            className="btn btn-outline-light me-2 flex-shrink-0"
            onClick={onHome}
            aria-label="Home"
          >
            <i className="bi bi-house-door d-lg-none"></i>
            <span className="d-none d-lg-inline">
              <i className="bi bi-house-door"></i> Home
            </span>
          </button>

          {/* Buscador (solo escritorio) */}
          <div
            className="d-none d-lg-flex flex-grow-1 mx-3"
            style={{ maxWidth: "500px" }}
          >
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
            <button className="btn btn-light" onClick={() => handleSearch()}>
              <i className="bi bi-search"></i>
            </button>
          </div>

          {/* Botones de autenticación / perfil */}
          <div className="d-flex ms-auto flex-shrink-0 gap-2 align-items-center">
            {!isAuthenticated ? (
              <>
                <button
                  className="btn btn-outline-light"
                  onClick={onLogin}
                  style={{ fontSize: "0.9rem", padding: "0.375rem 0.75rem" }}
                >
                  <span className="d-none d-sm-inline">Iniciar Sesión</span>
                  <span className="d-inline d-sm-none">Login</span>
                </button>
                <button
                  className="btn btn-light"
                  onClick={onRegister}
                  style={{ fontSize: "0.9rem", padding: "0.375rem 0.75rem" }}
                >
                  <span className="d-none d-sm-inline">Registrarse</span>
                  <span className="d-inline d-sm-none">Sign Up</span>
                </button>
              </>
            ) : (
              <div className="position-relative" ref={dropdownRef}>
                {/* Botón de perfil */}
                <button
                  className="btn btn-light d-flex align-items-center"
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    fontSize: "0.9rem",
                    padding: "0.375rem 0.75rem",
                  }}
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span className="d-none d-sm-inline ms-1">Perfil</span>
                  <i
                    className={`bi ms-1 ${
                      showDropdown ? "bi-caret-up-fill" : "bi-caret-down-fill"
                    }`}
                    style={{ fontSize: "0.7rem" }}
                  ></i>
                </button>

                {/* Dropdown flotante */}
                {showDropdown && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white shadow rounded border"
                    style={{
                      minWidth: "180px",
                      zIndex: 1050,
                    }}
                  >
                    <ul className="list-unstyled mb-0">
                      <li>
                        <button
                          className="dropdown-item py-2 px-3 w-100 text-start"
                          onClick={() => {
                            onProfile();
                            setShowDropdown(false);
                          }}
                        >
                          <i className="bi bi-person me-2"></i> Mi Perfil
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item py-2 px-3 w-100 text-start"
                          onClick={() => {
                            alert("Configuraciones");
                            setShowDropdown(false);
                          }}
                        >
                          <i className="bi bi-gear me-2"></i> Configuración
                        </button>
                      </li>
                      <li>
                        <hr className="dropdown-divider my-1" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item py-2 px-3 w-100 text-start text-danger"
                          onClick={() => {
                            localStorage.removeItem("access");
                            localStorage.removeItem("refresh");
                            localStorage.removeItem("productos");
                            setIsAuthenticated(false);
                            navigate("/dashboard");
                            setShowDropdown(false);
                          }}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Buscador mobile */}
        <div className="w-100 d-lg-none mt-2">
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
            <button className="btn btn-light" onClick={() => handleSearch()}>
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
