import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserHook } from "./usuario/UsuarioHook";
import UserForm from "./usuario/Form";
import { useNavigate } from "react-router-dom";
import Loading from "../components/loading";

const RegisterView: React.FC = () => {
  const { handleCreate, loading, message } = UserHook();
  const navigate = useNavigate();

  useEffect(()=>{
    localStorage.clear();
  },[]);

  if (loading) {
    return (
      <Loading />
    );
  }
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg p-4 p-md-5 rounded-4" style={{ maxWidth: "480px", width: "100%" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Crear cuenta</h2>
          <p className="text-muted mb-0">Regístrate para comenzar</p>
        </div>

        {message && (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}

        <UserForm onSubmit={handleCreate} />

        <div className="text-center mt-4">
          <p className="text-muted mb-0">
            ¿Ya tienes cuenta?{" "}
            <button type="button" className="btn btn-link w-100 mb-3" onClick={() => navigate('/login')}>
              Iniciar Sesion
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
