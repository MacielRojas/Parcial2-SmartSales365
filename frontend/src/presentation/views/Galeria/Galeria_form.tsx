import {useState, useEffect} from 'react';
import type { GaleriaEntity } from '../../../domain/entities/Galeria_entity';
import { FileField, NumberField } from '../../components/fields';

type GaleriaFormProps = {
  initialGaleria?: GaleriaEntity;
  onSubmit: (item: any|GaleriaEntity) => void;
  onCancel: () => void;
}

function GaleriaForm({initialGaleria, onSubmit, onCancel}: GaleriaFormProps) {
    const [item, setItem] = useState<GaleriaEntity>(
        initialGaleria ||
        {} as GaleriaEntity
    );

useEffect(() => {
  if (initialGaleria) {
    setItem(prev => ({...prev, initialGaleria:initialGaleria}));
  }
}, [initialGaleria]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const {name, value} = e.target;
  setItem(prev => ({...prev, [name]: value}));
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!item.producto){
    alert("Todos los campos son obligatorios");
    return;
  }
onSubmit(item);
};

return (
<form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
<h5 className="mb-3">{initialGaleria? "Editar Galeria": "Crear Galeria"}</h5>
<NumberField name={'producto'} onChange={handleChange} value={item.producto} label="producto" required={true}/>
<FileField name={'imagen'} onChange={handleChange} label="imagen" accept=".png, .jpg, .jpeg" required={true}/>
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialGaleria? "Editar Galeria": "Crear Galeria"}</button>
</div>

</form>

);
}

export default GaleriaForm;
