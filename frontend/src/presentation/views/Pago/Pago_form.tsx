import {useState, useEffect} from 'react';
import type { PagoEntity } from '../../../domain/entities/Pago_entity';
import { NumberField, TextField } from '../../components/fields';

type PagoFormProps = {
  initialPago?: PagoEntity;
  onSubmit: (item: any|PagoEntity) => void;
  onCancel: () => void;
}

function PagoForm({initialPago, onSubmit, onCancel}: PagoFormProps) {
    const [item, setItem] = useState<PagoEntity>(
        initialPago ||
        {} as PagoEntity
    );

useEffect(() => {
  if (initialPago) {
    setItem(prev => ({...prev, initialPago:initialPago}));
  }
}, [initialPago]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const {name, value} = e.target;
  setItem(prev => ({...prev, [name]: value}));
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!item.monto || 
!item.moneda.trim() || 
!item.estado.trim() || 
!item.carrito || 
!item.payment_method_id.trim() || 
!item.payment_intent.trim()){
    alert("Todos los campos son obligatorios");
    return;
  }
onSubmit(item);
};

return (
<form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
<h5 className="mb-3">{initialPago? "Editar Pago": "Crear Pago"}</h5>
<NumberField name={'monto'} onChange={handleChange} value={item.monto} label="monto" required={true}/>
<TextField name={'moneda'} onChange={handleChange} value={item.moneda} label="moneda" placeholder="moneda" required={true}/>
<TextField name={'estado'} onChange={handleChange} value={item.estado} label="estado" placeholder="estado" required={true}/>
<NumberField name={'carrito'} onChange={handleChange} value={item.carrito} label="carrito" required={true}/>
<TextField name={'payment_method_id'} onChange={handleChange} value={item.payment_method_id} label="payment_method_id" placeholder="payment_method_id" required={true}/>
<TextField name={'payment_intent'} onChange={handleChange} value={item.payment_intent} label="payment_intent" placeholder="payment_intent" required={true}/>
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialPago? "Editar Pago": "Crear Pago"}</button>
</div>

</form>

);
}

export default PagoForm;
