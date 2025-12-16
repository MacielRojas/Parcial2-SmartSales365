import { useState, useEffect } from 'react';
import { CategoriaUseCase } from '../../../application/usecases/Categoria_uc';
import { CategoriaEntity } from '../../../domain/entities/Categoria_entity';
import { APIGateway } from '../../../infraestructure/services/APIGateway';

type CategoriaHookProps = {
  items: CategoriaEntity[],
  loading: boolean,
  message: string,
  filtered: CategoriaEntity[],
};

export const CategoriaHook = () => {
  const [state, setState] = useState<CategoriaHookProps>({
    items: [],
    loading: false,
    message: '',
    filtered: [],
  });
  const uc = new CategoriaUseCase(new APIGateway());
  const loadItems = async () => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.get();
      if (!response){
        throw Error(`Error obteniendo Categoria`);
      }
        const objs = response;
        setState(prev => ({ ...prev, items: objs, filtered: objs,}));
    } catch (error) {
      setState(prev => ({ ...prev, message: `Error obteniendo Categoria: ${error}` }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCreate = async (data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.create(data);
      if (!response){
        throw Error(`Error creando Categoria`);
      }
      setState(prev => ({ ...prev, message: "Categoria creado"}));
      await loadItems();
    } catch (error) {
      throw Error(`Error creando Categoria: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.update(id, data);
      if (!response){
        throw Error(`Error actualizando Categoria`);
      }
      setState(prev => ({ ...prev, message: "Categoria actualizado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error actualizando Categoria: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.delete(id);
      if (!response){
        throw Error(`Error eliminando Categoria`);
      }
      setState(prev => ({ ...prev, message: "Categoria eliminado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error eliminando Categoria: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleSearch = async (value: string) => {
    if (!value){
      setState(prev => ({ ...prev, filtered: state.items }));
      return;
    }
    const lower=value.toLowerCase();
    const filtered = state.items.filter((item: CategoriaEntity) => {
      return item.id?.toString().toLowerCase().includes(lower) ||
item.nombre.toString().toLowerCase().includes(lower) ||
item.descripcion?.toString().toLowerCase().includes(lower);
    });
    setState(prev => ({ ...prev, filtered: filtered }));
  };

  useEffect(() => {
    loadItems();
  }, []);
  return { ...state, handleCreate, handleUpdate, handleDelete, handleSearch };
};

