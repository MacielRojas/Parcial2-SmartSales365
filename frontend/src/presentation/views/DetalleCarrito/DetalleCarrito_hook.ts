import { useState, useEffect } from 'react';
import { DetalleCarritoUseCase } from '../../../application/usecases/DetalleCarrito_uc';
import { DetalleCarritoEntity } from '../../../domain/entities/DetalleCarrito_entity';
import { APIGateway } from '../../../infraestructure/services/APIGateway';

type DetalleCarritoHookProps = {
  items: DetalleCarritoEntity[],
  loading: boolean,
  message: string,
  filtered: DetalleCarritoEntity[],
};

export const DetalleCarritoHook = () => {
  const [state, setState] = useState<DetalleCarritoHookProps>({
    items: [],
    loading: false,
    message: '',
    filtered: [],
  });
  const uc = new DetalleCarritoUseCase(new APIGateway());
  const loadItems = async () => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.get();
      if (!response){
        throw Error(`Error obteniendo DetalleCarrito`);
      }
        const objs = response;
        setState(prev => ({ ...prev, items: objs, filtered: objs,}));
    } catch (error) {
      setState(prev => ({ ...prev, message: `Error obteniendo DetalleCarrito: ${error}` }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCreate = async (data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.create(data);
      if (!response){
        throw Error(`Error creando DetalleCarrito`);
      }
      setState(prev => ({ ...prev, message: "DetalleCarrito creado"}));
      await loadItems();
    } catch (error) {
      throw Error(`Error creando DetalleCarrito: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.update(id, data);
      if (!response){
        throw Error(`Error actualizando DetalleCarrito`);
      }
      setState(prev => ({ ...prev, message: "DetalleCarrito actualizado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error actualizando DetalleCarrito: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.delete(id);
      if (!response){
        throw Error(`Error eliminando DetalleCarrito`);
      }
      setState(prev => ({ ...prev, message: "DetalleCarrito eliminado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error eliminando DetalleCarrito: ${error}`);
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
    const filtered = state.items.filter((item: DetalleCarritoEntity) => {
      return item.id?.toString().toLowerCase().includes(lower) ||
item.carrito?.toString().toLowerCase().includes(lower) ||
item.producto?.toString().toLowerCase().includes(lower) ||
item.cantidad?.toString().toLowerCase().includes(lower) ||
item.descuento?.toString().toLowerCase().includes(lower);
    });
    setState(prev => ({ ...prev, filtered: filtered }));
  };

  useEffect(() => {
    loadItems();
  }, []);
  return { ...state, handleCreate, handleUpdate, handleDelete, handleSearch };
};

