import { useState, useEffect } from 'react';
import { GarantiaUseCase } from '../../../application/usecases/Garantia_uc';
import { GarantiaEntity } from '../../../domain/entities/Garantia_entity';
import { APIGateway } from '../../../infraestructure/services/APIGateway';

type GarantiaHookProps = {
  items: GarantiaEntity[],
  loading: boolean,
  message: string,
  filtered: GarantiaEntity[],
};

export const GarantiaHook = () => {
  const [state, setState] = useState<GarantiaHookProps>({
    items: [],
    loading: false,
    message: '',
    filtered: [],
  });
  const uc = new GarantiaUseCase(new APIGateway());
  const loadItems = async () => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.get();
      if (!response){
        throw Error(`Error obteniendo Garantia`);
      }
        const objs = response;
        setState(prev => ({ ...prev, items: objs, filtered: objs,}));
    } catch (error) {
      setState(prev => ({ ...prev, message: `Error obteniendo Garantia: ${error}` }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCreate = async (data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.create(data);
      if (!response){
        throw Error(`Error creando Garantia`);
      }
      setState(prev => ({ ...prev, message: "Garantia creado"}));
      await loadItems();
    } catch (error) {
      throw Error(`Error creando Garantia: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.update(id, data);
      if (!response){
        throw Error(`Error actualizando Garantia`);
      }
      setState(prev => ({ ...prev, message: "Garantia actualizado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error actualizando Garantia: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.delete(id);
      if (!response){
        throw Error(`Error eliminando Garantia`);
      }
      setState(prev => ({ ...prev, message: "Garantia eliminado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error eliminando Garantia: ${error}`);
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
    const filtered = state.items.filter((item: GarantiaEntity) => {
      return item.id?.toString().toLowerCase().includes(lower) ||
item.producto?.toString().toLowerCase().includes(lower) ||
item.usuario?.toString().toLowerCase().includes(lower) ||
item.precio?.toString().toLowerCase().includes(lower) ||
item.fecha_inicio?.toString().toLowerCase().includes(lower) ||
item.fecha_fin?.toString().toLowerCase().includes(lower) ||
item.descripcion?.toString().toLowerCase().includes(lower) ||
item.estado?.toString().toLowerCase().includes(lower);
    });
    setState(prev => ({ ...prev, filtered: filtered }));
  };

  useEffect(() => {
    loadItems();
  }, []);
  return { ...state, handleCreate, handleUpdate, handleDelete, handleSearch };
};

