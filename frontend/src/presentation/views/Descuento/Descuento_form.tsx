import {useState, useEffect} from 'react';
import type { DescuentoEntity } from '../../../domain/entities/Descuento_entity';
import { DateField, NumberField, TextField } from '../../components/fields';

type DescuentoFormProps = {
  initialDescuento?: DescuentoEntity;
  onSubmit: (item: any|DescuentoEntity) => void;
  onCancel: () => void;
}

function DescuentoForm({initialDescuento, onSubmit, onCancel}: DescuentoFormProps) {
    const [item, setItem] = useState<DescuentoEntity>(
        initialDescuento ||
        {} as DescuentoEntity
    );

useEffect(() => {
  if (initialDescuento) {
    setItem(prev => ({...prev, initialDescuento:initialDescuento}));
  }
}, [initialDescuento]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const {name, value} = e.target;
  setItem(prev => ({...prev, [name]: value}));
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!item.tipo.trim() || 
!item.producto || 
!item.valor){
    alert("Todos los campos son obligatorios");
    return;
  }
onSubmit(item);
};

return (
<form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
<h5 className="mb-3">{initialDescuento? "Editar Descuento": "Crear Descuento"}</h5>
<TextField name={'tipo'} onChange={handleChange} value={item.tipo} label="tipo" placeholder="tipo" required={true}/>
<NumberField name={'producto'} onChange={handleChange} value={item.producto} label="producto" required={true}/>
<NumberField name={'valor'} onChange={handleChange} value={item.valor} label="valor" required={true}/>
<DateField name={'fecha_inicio'} onChange={handleChange} value={item.fecha_inicio??Date.now().toString()} label="fecha_inicio"  />
<DateField name={'fecha_fin'} onChange={handleChange} value={item.fecha_fin??Date.now().toString()} label="fecha_fin" />
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialDescuento? "Editar Descuento": "Crear Descuento"}</button>
</div>

</form>

);
}

export default DescuentoForm;
