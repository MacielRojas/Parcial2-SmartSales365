import {useState, useEffect} from 'react';
import type { BitacoraEntity } from '../../../domain/entities/Bitacora_entity';
import { NumberField, TextField } from '../../components/fields';

type BitacoraFormProps = {
  initialBitacora?: BitacoraEntity;
  onSubmit: (item: any|BitacoraEntity) => void;
  onCancel: () => void;
}

function BitacoraForm({initialBitacora, onSubmit, onCancel}: BitacoraFormProps) {
    const [item, setItem] = useState<BitacoraEntity>(
        initialBitacora ||
        {} as BitacoraEntity
    );

useEffect(() => {
  if (initialBitacora) {
    setItem(initialBitacora);
  }
}, [initialBitacora]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const {name, value} = e.target;
  setItem(prev => ({...prev, [name]: value}));
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!item.usuario || 
!item.accion.trim() || 
!item.ipv4.trim() || 
!item.nivel.trim()){
    alert("Todos los campos son obligatorios");
    return;
  }
onSubmit(item);
};

return (
<form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
<h5 className="mb-3">{initialBitacora? "Editar Bitacora": "Crear Bitacora"}</h5>
<NumberField name={'usuario'} onChange={handleChange} value={item.usuario} label="usuario" required={true}/>
<TextField name={'accion'} onChange={handleChange} value={item.accion} label="accion" placeholder="accion" required={true}/>
<TextField name={'ipv4'} onChange={handleChange} value={item.ipv4} label="ipv4" placeholder="ipv4" required={true}/>
<TextField name={'nivel'} onChange={handleChange} value={item.nivel} label="nivel" placeholder="nivel" required={true}/>
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialBitacora? "Editar Bitacora": "Crear Bitacora"}</button>
</div>

</form>

);
}

export default BitacoraForm;
