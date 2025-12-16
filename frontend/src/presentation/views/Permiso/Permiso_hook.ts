import { useState, useEffect } from 'react';
import { PermisoUseCase } from '../../../application/usecases/Permiso_uc';
import { PermisoEntity } from '../../../domain/entities/Permiso_entity';
import { APIGateway } from '../../../infraestructure/services/APIGateway';

type PermisoHookProps = {
  items: PermisoEntity[],
  loading: boolean,
  message: string,
  filtered: PermisoEntity[],
};

export const PermisoHook = () => {
  const [state, setState] = useState<PermisoHookProps>({
    items: [],
    loading: false,
    message: '',
    filtered: [],
  });
  const uc = new PermisoUseCase(new APIGateway());
  const loadItems = async () => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.get();
      if (!response){
        throw Error(`Error obteniendo Permiso`);
      }
        const objs = response;
        setState(prev => ({ ...prev, items: objs, filtered: objs,}));
    } catch (error) {
      setState(prev => ({ ...prev, message: `Error obteniendo Permiso: ${error}` }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCreate = async (data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.create(data);
      if (!response){
        throw Error(`Error creando Permiso`);
      }
      setState(prev => ({ ...prev, message: "Permiso creado"}));
      await loadItems();
    } catch (error) {
      throw Error(`Error creando Permiso: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.update(id, data);
      if (!response){
        throw Error(`Error actualizando Permiso`);
      }
      setState(prev => ({ ...prev, message: "Permiso actualizado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error actualizando Permiso: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.delete(id);
      if (!response){
        throw Error(`Error eliminando Permiso`);
      }
      setState(prev => ({ ...prev, message: "Permiso eliminado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error eliminando Permiso: ${error}`);
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
    const filtered = state.items.filter((item: PermisoEntity) => {
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

