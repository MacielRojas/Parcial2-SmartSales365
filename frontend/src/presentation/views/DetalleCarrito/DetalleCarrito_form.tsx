import {useState, useEffect} from 'react';
import type { DetalleCarritoEntity } from '../../../domain/entities/DetalleCarrito_entity';
import { NumberField } from '../../components/fields';

type DetalleCarritoFormProps = {
  initialDetalleCarrito?: DetalleCarritoEntity;
  onSubmit: (item: any|DetalleCarritoEntity) => void;
  onCancel: () => void;
}

function DetalleCarritoForm({initialDetalleCarrito, onSubmit, onCancel}: DetalleCarritoFormProps) {
    const [item, setItem] = useState<DetalleCarritoEntity>(
        initialDetalleCarrito ||
        {} as DetalleCarritoEntity
    );

useEffect(() => {
  if (initialDetalleCarrito) {
    setItem(prev => ({...prev, initialDetalleCarrito:initialDetalleCarrito}));
  }
}, [initialDetalleCarrito]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const {name, value} = e.target;
  setItem(prev => ({...prev, [name]: value}));
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!item.carrito || 
!item.producto || 
!item.cantidad){
    alert("Todos los campos son obligatorios");
    return;
  }
onSubmit(item);
};

return (
<form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
<h5 className="mb-3">{initialDetalleCarrito? "Editar DetalleCarrito": "Crear DetalleCarrito"}</h5>
<NumberField name={'carrito'} onChange={handleChange} value={item.carrito} label="carrito" required={true}/>
<NumberField name={'producto'} onChange={handleChange} value={item.producto} label="producto" required={true}/>
<NumberField name={'cantidad'} onChange={handleChange} value={item.cantidad} label="cantidad" required={true}/>
<NumberField name={'descuento'} onChange={handleChange} value={item.descuento??0} label="descuento" />
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialDetalleCarrito? "Editar DetalleCarrito": "Crear DetalleCarrito"}</button>
</div>

</form>

);
}

export default DetalleCarritoForm;
