import {useState, useEffect} from 'react';
import type { RolEntity } from '../../../domain/entities/Rol_entity';
import { TextField } from '../../components/fields';

type RolFormProps = {
  initialRol?: RolEntity;
  onSubmit: (item: any|RolEntity) => void;
  onCancel: () => void;
}

function RolForm({initialRol, onSubmit, onCancel}: RolFormProps) {
    const [item, setItem] = useState<RolEntity>(
        initialRol ||
        {} as RolEntity
    );

useEffect(() => {
  if (initialRol) {
    setItem(prev => ({...prev, initialRol:initialRol}));
  }
}, [initialRol]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const {name, value} = e.target;
  setItem(prev => ({...prev, [name]: value}));
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!item.nombre.trim()){
    alert("Todos los campos son obligatorios");
    return;
  }
onSubmit(item);
};

return (
<form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
<h5 className="mb-3">{initialRol? "Editar Rol": "Crear Rol"}</h5>
<TextField name={'nombre'} onChange={handleChange} value={item.nombre} label="nombre" placeholder="nombre" required={true}/>
<TextField name={'descripcion'} onChange={handleChange} value={item.descripcion??""} label="descripcion" placeholder="descripcion" />
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialRol? "Editar Rol": "Crear Rol"}</button>
</div>

</form>

);
}

export default RolForm;
