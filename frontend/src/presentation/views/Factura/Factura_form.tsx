import {useState, useEffect} from 'react';
import type { FacturaEntity } from '../../../domain/entities/Factura_entity';
import { DateField, NumberField, TextField } from '../../components/fields';

type FacturaFormProps = {
  initialFactura?: FacturaEntity;
  onSubmit: (item: any|FacturaEntity) => void;
  onCancel: () => void;
}

function FacturaForm({initialFactura, onSubmit, onCancel}: FacturaFormProps) {
    const [item, setItem] = useState<FacturaEntity>(
        initialFactura ||
        {} as FacturaEntity
    );

useEffect(() => {
  if (initialFactura) {
    setItem(prev => ({...prev, initialFactura:initialFactura}));
  }
}, [initialFactura]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const {name, value} = e.target;
  setItem(prev => ({...prev, [name]: value}));
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!item.venta){
    alert("Todos los campos son obligatorios");
    return;
  }
onSubmit(item);
};

return (
<form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
<h5 className="mb-3">{initialFactura? "Editar Factura": "Crear Factura"}</h5>
<NumberField name={'venta'} onChange={handleChange} value={item.venta} label="venta" required={true}/>
<DateField name={'fecha_expendida'} onChange={handleChange} value={item.fecha_expendida??Date.now().toString()} label="fecha_expendida" />
<TextField name={'nit'} onChange={handleChange} value={item.nit??""} label="nit" placeholder="nit" />
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialFactura? "Editar Factura": "Crear Factura"}</button>
</div>

</form>

);
}

export default FacturaForm;
