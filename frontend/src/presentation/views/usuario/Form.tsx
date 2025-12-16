// src/components/UserForm.tsx
import { useState } from "react";
import type { User } from "../../../domain/entities/Usuario";
import { CheckboxGroupField, DateField, EmailField, PasswordField, SelectField, TextField } from "../../components/fields";

type UserFormProps = {
  initialUser?: User; // si se pasa, es modo edición
  onSubmit: (user: any | User) => void; // callback al enviar
  onCancel?: () => void; // opcional: cancelar
};

function UserForm({ initialUser, onSubmit, onCancel }: UserFormProps) {
  const [password, setPassword] = useState<string>("");
  const [user, setUser] = useState<User>( 
    initialUser || 
    {} as User
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name !== "password") {
      setUser({ ...user, [name]: value });
    } else {
      setPassword(value);
    }
  };

  const handleCheckboxChange = (name: string, values: string[]) => {
    setUser({ ...user, [name]: values });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.first_name.trim() ||
      !user.last_name.trim() ||
      !user.username.trim() ||
      !user.email.trim()) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    onSubmit(initialUser ? user : {...user, password: password});
  };

  return (
    <form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
      <h5 className="mb-3">{initialUser ? "Editar Usuario" : "Crear Usuario"}</h5>

      {/* Username */}
      <TextField label="Username" name="username" value={user.username} placeholder="Ej: Juan" required onChange={handleChange} />

      {/* Nombre */}
      <TextField label="Nombre" name="first_name" value={user.first_name} placeholder="Ej: Juan" required onChange={handleChange} />

      {/* Apellido */}
      <TextField label="Apellido" name="last_name" value={user.last_name} placeholder="Ej: Pérez" required={true} onChange={handleChange} />

      {/* Email */}
      <EmailField value={user.email} onChange={handleChange} />

      {/* Genero Sexo M o F */}
      <SelectField label="Sexo" name="gender" value={user.gender ?? "Seleccione una opción"} options={[{ value: "M", label: "Masculino" }, { value: "F", label: "Femenino" }]} required onChange={handleChange} />

      {!initialUser && (
        //  Password
        <PasswordField value={password} onChange={handleChange} />
        
      )}

      {/* Fecha de Nacimiento */}
      <DateField label="Fecha de Nacimiento" name="born_date" value={user.born_date} min="1900-01-01" max="2023-12-31" required onChange={handleChange} />
      
      {/* Rol */}
      {/* <SelectField label="Rol" name="rol" value={user.rol ?? "Cliente"} options={[{ value: "Administrador", label: "Administrador" }, { value: "Cliente", label: "Cliente" }]} required onChange={handleChange} /> */}
      <CheckboxGroupField label="Rol" name="rol" value={user.rol??[]}  options={[{value:"Administrador" ,label:"Administrador"},{value:"Cliente",label:"Cliente"},]} onChange={handleCheckboxChange} />

      {/* Botones */}
      <div className="d-flex justify-content-end gap-2">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {initialUser ? "Guardar Cambios" : "Crear Usuario"}
        </button>
      </div>
    </form>
  );
}

export default UserForm;
