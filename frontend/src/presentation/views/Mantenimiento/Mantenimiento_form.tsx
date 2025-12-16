import {useState, useEffect} from 'react';
import type { MantenimientoEntity } from '../../../domain/entities/Mantenimiento_entity';
import { DateField, NumberField, TextField } from '../../components/fields';

type MantenimientoFormProps = {
  initialMantenimiento?: MantenimientoEntity;
  onSubmit: (item: any|MantenimientoEntity) => void;
  onCancel: () => void;
}

function MantenimientoForm({initialMantenimiento, onSubmit, onCancel}: MantenimientoFormProps) {
    const [item, setItem] = useState<MantenimientoEntity>(
        initialMantenimiento ||
        {} as MantenimientoEntity
    );

useEffect(() => {
  if (initialMantenimiento) {
    setItem(prev => ({...prev, initialMantenimiento:initialMantenimiento}));
  }
}, [initialMantenimiento]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const {name, value} = e.target;
  setItem(prev => ({...prev, [name]: value}));
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!item.producto || 
!item.precio || 
!item.estado.trim() || 
!item.usuario){
    alert("Todos los campos son obligatorios");
    return;
  }
onSubmit(item);
};

return (
<form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
<h5 className="mb-3">{initialMantenimiento? "Editar Mantenimiento": "Crear Mantenimiento"}</h5>
<NumberField name={'producto'} onChange={handleChange} value={item.producto} label="producto" required={true}/>
<NumberField name={'precio'} onChange={handleChange} value={item.precio} label="precio" required={true}/>
<DateField name={'fecha_programada'} onChange={handleChange} value={item.fecha_programada??Date.now().toString()} label="fecha_programada" />
<TextField name={'estado'} onChange={handleChange} value={item.estado} label="estado" placeholder="estado" required={true}/>
<NumberField name={'usuario'} onChange={handleChange} value={item.usuario} label="usuario" required={true}/>
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialMantenimiento? "Editar Mantenimiento": "Crear Mantenimiento"}</button>
</div>

</form>

);
}

export default MantenimientoForm;
