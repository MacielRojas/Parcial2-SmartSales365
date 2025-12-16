import {useState, useEffect} from 'react';
import type { CarritoEntity } from '../../../domain/entities/Carrito_entity';
import { NumberField } from '../../components/fields';

type CarritoFormProps = {
  initialCarrito?: CarritoEntity;
  onSubmit: (item: any|CarritoEntity) => void;
  onCancel: () => void;
}

function CarritoForm({initialCarrito, onSubmit, onCancel}: CarritoFormProps) {
    const [item, setItem] = useState<CarritoEntity>(
        initialCarrito ||
        {} as CarritoEntity
    );

useEffect(() => {
  if (initialCarrito) {
    setItem(prev => ({...prev, initialCarrito:initialCarrito}));
  }
}, [initialCarrito]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const {name, value} = e.target;
  setItem(prev => ({...prev, [name]: value}));
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!item.usuario || 
!item.total){
    alert("Todos los campos son obligatorios");
    return;
  }
onSubmit(item);
};

return (
<form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
<h5 className="mb-3">{initialCarrito? "Editar Carrito": "Crear Carrito"}</h5>
<NumberField name={'usuario'} onChange={handleChange} value={item.usuario} label="usuario" required={true}/>
<NumberField name={'total'} onChange={handleChange} value={item.total} label="total" required={true}/>
<NumberField name={'descuento'} onChange={handleChange} value={item.descuento??0} label="descuento" />
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialCarrito? "Editar Carrito": "Crear Carrito"}</button>
</div>

</form>

);
}

export default CarritoForm;
