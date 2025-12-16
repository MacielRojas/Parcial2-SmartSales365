import React, { useState } from "react";

interface PasswordFormProps {
  onChangePassword: (data: { current: string; newPass: string }) => void;
}

const ProfilePasswordForm: React.FC<PasswordFormProps> = ({
  onChangePassword,
}) => {
  const [formData, setFormData] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPass !== formData.confirm) {
      alert("Las contraseñas no coinciden ❌");
      return;
    }
    onChangePassword(formData);
    setFormData({ current: "", newPass: "", confirm: "" });
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h5 className="mb-3">
          <i className="bi bi-lock me-2"></i> Cambiar Contraseña
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Contraseña actual</label>
            <input
              type="password"
              className="form-control"
              name="current"
              value={formData.current}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              name="newPass"
              value={formData.newPass}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirmar nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-outline-primary w-100">
            Actualizar contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePasswordForm;
