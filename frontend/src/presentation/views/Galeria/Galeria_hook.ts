import { useState, useEffect } from 'react';
import { GaleriaUseCase } from '../../../application/usecases/Galeria_uc';
import { GaleriaEntity } from '../../../domain/entities/Galeria_entity';
import { APIGateway } from '../../../infraestructure/services/APIGateway';

type GaleriaHookProps = {
  items: GaleriaEntity[],
  loading: boolean,
  message: string,
  filtered: GaleriaEntity[],
};

export const GaleriaHook = () => {
  const [state, setState] = useState<GaleriaHookProps>({
    items: [],
    loading: false,
    message: '',
    filtered: [],
  });
  const uc = new GaleriaUseCase(new APIGateway());
  const loadItems = async () => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.get();
      if (!response){
        throw Error(`Error obteniendo Galeria`);
      }
        const objs = response;
        setState(prev => ({ ...prev, items: objs, filtered: objs,}));
    } catch (error) {
      setState(prev => ({ ...prev, message: `Error obteniendo Galeria: ${error}` }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCreate = async (data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.create(data);
      if (!response){
        throw Error(`Error creando Galeria`);
      }
      setState(prev => ({ ...prev, message: "Galeria creado"}));
      await loadItems();
    } catch (error) {
      throw Error(`Error creando Galeria: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.update(id, data);
      if (!response){
        throw Error(`Error actualizando Galeria`);
      }
      setState(prev => ({ ...prev, message: "Galeria actualizado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error actualizando Galeria: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.delete(id);
      if (!response){
        throw Error(`Error eliminando Galeria`);
      }
      setState(prev => ({ ...prev, message: "Galeria eliminado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error eliminando Galeria: ${error}`);
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
    const filtered = state.items.filter((item: GaleriaEntity) => {
      return item.id?.toString().toLowerCase().includes(lower) ||
item.producto?.toString().toLowerCase().includes(lower) ||
item.imagen?.toString().toLowerCase().includes(lower);
    });
    setState(prev => ({ ...prev, filtered: filtered }));
  };

  useEffect(() => {
    loadItems();
  }, []);
  return { ...state, handleCreate, handleUpdate, handleDelete, handleSearch };
};

