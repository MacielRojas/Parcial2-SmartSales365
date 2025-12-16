import {useState, useEffect} from 'react';
import type { GarantiaEntity } from '../../../domain/entities/Garantia_entity';
import { DateField, NumberField, TextField } from '../../components/fields';

type GarantiaFormProps = {
  initialGarantia?: GarantiaEntity;
  onSubmit: (item: any|GarantiaEntity) => void;
  onCancel: () => void;
}

function GarantiaForm({initialGarantia, onSubmit, onCancel}: GarantiaFormProps) {
    const [item, setItem] = useState<GarantiaEntity>(
        initialGarantia ||
        {} as GarantiaEntity
    );

useEffect(() => {
  if (initialGarantia) {
    setItem(prev => ({...prev, initialGarantia:initialGarantia}));
  }
}, [initialGarantia]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const {name, value} = e.target;
  setItem(prev => ({...prev, [name]: value}));
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!item.producto || 
!item.usuario || 
!item.precio || 
!item.estado.trim()){
    alert("Todos los campos son obligatorios");
    return;
  }
onSubmit(item);
};

return (
<form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
<h5 className="mb-3">{initialGarantia? "Editar Garantia": "Crear Garantia"}</h5>
<NumberField name={'producto'} onChange={handleChange} value={item.producto} label="producto" required={true}/>
<NumberField name={'usuario'} onChange={handleChange} value={item.usuario} label="usuario" required={true}/>
<NumberField name={'precio'} onChange={handleChange} value={item.precio} label="precio" required={true}/>
<DateField name={'fecha_inicio'} onChange={handleChange} value={item.fecha_inicio??Date.now().toString()} label="fecha_inicio"  />
<DateField name={'fecha_fin'} onChange={handleChange} value={item.fecha_fin??Date.now().toString()} label="fecha_fin"  />
<TextField name={'descripcion'} onChange={handleChange} value={item.descripcion??''} label="descripcion" placeholder="descripcion" />
<TextField name={'estado'} onChange={handleChange} value={item.estado} label="estado" placeholder="estado" required={true}/>
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialGarantia? "Editar Garantia": "Crear Garantia"}</button>
</div>

</form>

);
}

export default GarantiaForm;
