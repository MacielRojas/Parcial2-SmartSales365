import { useState, useEffect } from 'react';
import { RolUseCase } from '../../../application/usecases/Rol_uc';
import { RolEntity } from '../../../domain/entities/Rol_entity';
import { APIGateway } from '../../../infraestructure/services/APIGateway';

type RolHookProps = {
  items: RolEntity[],
  loading: boolean,
  message: string,
  filtered: RolEntity[],
};

export const RolHook = () => {
  const [state, setState] = useState<RolHookProps>({
    items: [],
    loading: false,
    message: '',
    filtered: [],
  });
  const uc = new RolUseCase(new APIGateway());
  const loadItems = async () => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.get();
      if (!response){
        throw Error(`Error obteniendo Rol`);
      }
        const objs = response;
        setState(prev => ({ ...prev, items: objs, filtered: objs,}));
    } catch (error) {
      setState(prev => ({ ...prev, message: `Error obteniendo Rol: ${error}` }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCreate = async (data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.create(data);
      if (!response){
        throw Error(`Error creando Rol`);
      }
      setState(prev => ({ ...prev, message: "Rol creado"}));
      await loadItems();
    } catch (error) {
      throw Error(`Error creando Rol: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.update(id, data);
      if (!response){
        throw Error(`Error actualizando Rol`);
      }
      setState(prev => ({ ...prev, message: "Rol actualizado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error actualizando Rol: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.delete(id);
      if (!response){
        throw Error(`Error eliminando Rol`);
      }
      setState(prev => ({ ...prev, message: "Rol eliminado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error eliminando Rol: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleSearch = (value: string) => {
    if (!value){
      setState(prev => ({ ...prev, filtered: state.items }));
      return;
    }
    const lower=value.toLowerCase();
    const filtered = state.items.filter((item: RolEntity) => {
      return item.id?.toString().toLowerCase().includes(lower) ||
item.nombre?.toString().toLowerCase().includes(lower) ||
item.descripcion?.toString().toLowerCase().includes(lower);
    });
    setState(prev => ({ ...prev, filtered: filtered }));
  };

  useEffect(() => {
    loadItems();
  }, []);
  return { ...state, handleCreate, handleUpdate, handleDelete, handleSearch };
};

