import {useState, useEffect} from 'react';
import type { ProductoEntity } from '../../../domain/entities/Producto_entity';
import { NumberField, TextField } from '../../components/fields';

type ProductoFormProps = {
  initialProducto?: ProductoEntity;
  onSubmit: (item: any|ProductoEntity) => void;
  onCancel: () => void;
}

function ProductoForm({initialProducto, onSubmit, onCancel}: ProductoFormProps) {
    const [item, setItem] = useState<ProductoEntity>(
        initialProducto ||
        {} as ProductoEntity
    );

useEffect(() => {
  if (initialProducto) {
    setItem(prev => ({...prev, initialProducto:initialProducto}));
  }
}, [initialProducto]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const {name, value} = e.target;
  setItem(prev => ({...prev, [name]: value}));
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!item.nombre.trim() || 
!item.precio || 
!item.stock || 
!item.codigo.trim() || 
!item.marca.trim() || 
!item.categoria){
    alert("Todos los campos son obligatorios");
    return;
  }
onSubmit(item);
};

return (
<form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
<h5 className="mb-3">{initialProducto? "Editar Producto": "Crear Producto"}</h5>
<TextField name={'nombre'} onChange={handleChange} value={item.nombre} label="nombre" placeholder="nombre" required={true}/>
<NumberField name={'precio'} onChange={handleChange} value={item.precio} label="precio" required={true}/>
<NumberField name={'stock'} onChange={handleChange} value={item.stock} label="stock" required={true}/>
<TextField name={'codigo'} onChange={handleChange} value={item.codigo} label="codigo" placeholder="codigo" required={true}/>
<TextField name={'marca'} onChange={handleChange} value={item.marca} label="marca" placeholder="marca" required={true}/>
<NumberField name={'categoria'} onChange={handleChange} value={item.categoria} label="categoria" required={true}/>
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialProducto? "Editar Producto": "Crear Producto"}</button>
</div>

</form>

);
}

export default ProductoForm;
