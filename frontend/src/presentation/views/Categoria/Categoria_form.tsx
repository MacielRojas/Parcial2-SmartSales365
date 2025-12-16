import {useState, useEffect} from 'react';
import type { CategoriaEntity } from '../../../domain/entities/Categoria_entity';
import { TextField } from '../../components/fields';

type CategoriaFormProps = {
  initialCategoria?: CategoriaEntity;
  onSubmit: (item: any|CategoriaEntity) => void;
  onCancel: () => void;
}

function CategoriaForm({initialCategoria, onSubmit, onCancel}: CategoriaFormProps) {
    const [item, setItem] = useState<CategoriaEntity>(
        initialCategoria ||
        {} as CategoriaEntity
    );

useEffect(() => {
  if (initialCategoria) {
    setItem(prev => ({...prev, initialCategoria:initialCategoria}));
  }
}, [initialCategoria]);

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
<h5 className="mb-3">{initialCategoria? "Editar Categoria": "Crear Categoria"}</h5>
<TextField name={'nombre'} onChange={handleChange} value={item.nombre} label="nombre" placeholder="nombre" required={true}/>
<TextField name={'descripcion'} onChange={handleChange} value={item.descripcion??""} label="descripcion" placeholder="descripcion" />
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialCategoria? "Editar Categoria": "Crear Categoria"}</button>
</div>

</form>

);
}

export default CategoriaForm;
