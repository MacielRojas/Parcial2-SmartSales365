import {useState, useEffect} from 'react';
import type { UserRolEntity } from '../../../domain/entities/UserRol_entity';
import { NumberField } from '../../components/fields';

type UserRolFormProps = {
  initialUserRol?: UserRolEntity;
  onSubmit: (item: any|UserRolEntity) => void;
  onCancel: () => void;
}

function UserRolForm({initialUserRol, onSubmit, onCancel}: UserRolFormProps) {
    const [item, setItem] = useState<UserRolEntity>(
        initialUserRol ||
        {} as UserRolEntity
    );

useEffect(() => {
  if (initialUserRol) {
    setItem(prev => ({...prev, initialUserRol:initialUserRol}));
  }
}, [initialUserRol]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const {name, value} = e.target;
  setItem(prev => ({...prev, [name]: value}));
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!item.user || 
!item.rol){
    alert("Todos los campos son obligatorios");
    return;
  }
onSubmit(item);
};

return (
<form className="p-4 border rounded shadow-sm bg-light" onSubmit={handleSubmit}>
<h5 className="mb-3">{initialUserRol? "Editar UserRol": "Crear UserRol"}</h5>
<NumberField name={'user'} onChange={handleChange} value={item.user} label="user" required={true}/>
<NumberField name={'rol'} onChange={handleChange} value={item.rol} label="rol" required={true}/>
<div className="d-flex justify-content-end gap-2">
{onCancel && (<button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>)}
<button type="submit" className="btn btn-primary" onClick={handleSubmit}>{initialUserRol? "Editar UserRol": "Crear UserRol"}</button>
</div>

</form>

);
}

export default UserRolForm;
