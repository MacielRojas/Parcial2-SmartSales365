import {useState, useEffect} from 'react';
import type { VentaEntity } from '../../../domain/entities/Venta_entity';
import { NumberField } from '../../components/fields';

type VentaFormProps = {
  initialVenta?: VentaEntity;
  onSubmit: (item: any|VentaEntity) => void;
  onCancel: () => void;
}

function VentaForm({initialVenta, onSubmit, onCancel}: VentaFormProps) {
    const [item, setItem] = useState<VentaEntity>(
        initialVenta ||
        {} as VentaEntity
    );

useEffect(() => {
  if (initialVenta) {
    setItem(prev => ({...prev, initialVenta:initialVenta}));
  }
}, [initialVenta]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const {name, value} = e.target;
  setItem(prev => ({...prev, [name]: value}));
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!item.carrito || 
!item.pago){
    alert("Todos los campos son obligatorios");
    return;
  }
onSubmit(item);
};

return (
<form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
<h5 className="mb-3">{initialVenta? "Editar Venta": "Crear Venta"}</h5>
<NumberField name={'carrito'} onChange={handleChange} value={item.carrito} label="carrito" required={true}/>
<NumberField name={'pago'} onChange={handleChange} value={item.pago} label="pago" required={true}/>
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialVenta? "Editar Venta": "Crear Venta"}</button>
</div>

</form>

);
}

export default VentaForm;
