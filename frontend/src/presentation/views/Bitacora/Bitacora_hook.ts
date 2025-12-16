import { useState, useEffect } from 'react';
import { BitacoraUseCase } from '../../../application/usecases/Bitacora_uc';
import { BitacoraEntity } from '../../../domain/entities/Bitacora_entity';
import { APIGateway } from '../../../infraestructure/services/APIGateway';

type BitacoraHookProps = {
  items: BitacoraEntity[],
  loading: boolean,
  message: string,
  filtered: BitacoraEntity[],
};

export interface BitacoraEntry {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  fecha: string;
  usuario?: string;
}

export interface BitacoraFilters {
  tipo?: string;
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export const BitacoraHook = () => {
  const [state, setState] = useState<BitacoraHookProps>({
    items: [],
    loading: false,
    message: '',
    filtered: [],
  });
  const uc = new BitacoraUseCase(new APIGateway());
  const loadItems = async () => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.get();
      if (!response){
        throw Error(`Error obteniendo Bitacora`);
      }
        const objs = response;
        setState(prev => ({ ...prev, items: objs, filtered: objs,}));
    } catch (error) {
      setState(prev => ({ ...prev, message: `Error obteniendo Bitacora: ${error}` }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCreate = async (data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.create(data);
      if (!response){
        throw Error(`Error creando Bitacora`);
      }
      setState(prev => ({ ...prev, message: "Bitacora creado"}));
      await loadItems();
    } catch (error) {
      throw Error(`Error creando Bitacora: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.update(id, data);
      if (!response){
        throw Error(`Error actualizando Bitacora`);
      }
      setState(prev => ({ ...prev, message: "Bitacora actualizado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error actualizando Bitacora: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.delete(id);
      if (!response){
        throw Error(`Error eliminando Bitacora`);
      }
      setState(prev => ({ ...prev, message: "Bitacora eliminado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error eliminando Bitacora: ${error}`);
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
    const filtered = state.items.filter((item: BitacoraEntity) => {
      return item.id?.toString().toLowerCase().includes(lower) ||
item.usuario?.toString().toLowerCase().includes(lower) ||
item.accion?.toString().toLowerCase().includes(lower) ||
item.ipv4?.toString().toLowerCase().includes(lower) ||
item.nivel?.toString().toLowerCase().includes(lower);
    });
    setState(prev => ({ ...prev, filtered: filtered }));
  };

  useEffect(() => {
    loadItems();
  }, []);
  return { ...state, handleCreate, handleUpdate, handleDelete, handleSearch };
};

