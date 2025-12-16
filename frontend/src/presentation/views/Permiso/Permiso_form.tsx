import {useState, useEffect} from 'react';
import type { PermisoEntity } from '../../../domain/entities/Permiso_entity';
import { TextField } from '../../components/fields';

type PermisoFormProps = {
  initialPermiso?: PermisoEntity;
  onSubmit: (item: any|PermisoEntity) => void;
  onCancel: () => void;
}

function PermisoForm({initialPermiso, onSubmit, onCancel}: PermisoFormProps) {
    const [item, setItem] = useState<PermisoEntity>(
        initialPermiso ||
        {} as PermisoEntity
    );

useEffect(() => {
  if (initialPermiso) {
    setItem(prev => ({...prev, initialPermiso:initialPermiso}));
  }
}, [initialPermiso]);

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
<h5 className="mb-3">{initialPermiso? "Editar Permiso": "Crear Permiso"}</h5>
<TextField name={'nombre'} onChange={handleChange} value={item.nombre} label="nombre" placeholder="nombre" required={true}/>
<TextField name={'descripcion'} onChange={handleChange} value={item.descripcion??""} label="descripcion" placeholder="descripcion" />
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialPermiso? "Editar Permiso": "Crear Permiso"}</button>
</div>

</form>

);
}

export default PermisoForm;
