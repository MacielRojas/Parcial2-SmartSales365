import { useState, useEffect } from 'react';
import { CarritoUseCase } from '../../../application/usecases/Carrito_uc';
import { CarritoEntity } from '../../../domain/entities/Carrito_entity';
import { APIGateway } from '../../../infraestructure/services/APIGateway';

type CarritoHookProps = {
  items: CarritoEntity[],
  loading: boolean,
  message: string,
  filtered: CarritoEntity[],
};

export const CarritoHook = () => {
  const [state, setState] = useState<CarritoHookProps>({
    items: [],
    loading: false,
    message: '',
    filtered: [],
  });
  const uc = new CarritoUseCase(new APIGateway());
  const loadItems = async () => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.get();
      if (!response){
        throw Error(`Error obteniendo Carrito`);
      }
        const objs = response;
        setState(prev => ({ ...prev, items: objs, filtered: objs,}));
    } catch (error) {
      setState(prev => ({ ...prev, message: `Error obteniendo Carrito: ${error}` }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCreate = async (data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.create(data);
      if (!response){
        throw Error(`Error creando Carrito`);
      }
      setState(prev => ({ ...prev, message: "Carrito creado"}));
      await loadItems();
    } catch (error) {
      throw Error(`Error creando Carrito: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.update(id, data);
      if (!response){
        throw Error(`Error actualizando Carrito`);
      }
      setState(prev => ({ ...prev, message: "Carrito actualizado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error actualizando Carrito: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.delete(id);
      if (!response){
        throw Error(`Error eliminando Carrito`);
      }
      setState(prev => ({ ...prev, message: "Carrito eliminado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error eliminando Carrito: ${error}`);
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
    const filtered = state.items.filter((item: CarritoEntity) => {
      return item.id?.toString().toLowerCase().includes(lower) ||
item.usuario?.toString().toLowerCase().includes(lower) ||
item.total?.toString().toLowerCase().includes(lower) ||
item.descuento?.toString().toLowerCase().includes(lower);
    });
    setState(prev => ({ ...prev, filtered: filtered }));
  };

  useEffect(() => {
    loadItems();
  }, []);

  return { ...state, handleCreate, handleUpdate, handleDelete, handleSearch, };
};

