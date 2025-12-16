import { useState, useEffect } from 'react';
import { VentaUseCase } from '../../../application/usecases/Venta_uc';
import { VentaEntity } from '../../../domain/entities/Venta_entity';
import { APIGateway } from '../../../infraestructure/services/APIGateway';

type VentaHookProps = {
  items: VentaEntity[],
  loading: boolean,
  message: string,
  filtered: VentaEntity[],
};

export const VentaHook = () => {
  const [state, setState] = useState<VentaHookProps>({
    items: [],
    loading: false,
    message: '',
    filtered: [],
  });
  const uc = new VentaUseCase(new APIGateway());
  const loadItems = async () => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.get();
      if (!response){
        throw Error(`Error obteniendo Venta`);
      }
        const objs = response;
        setState(prev => ({ ...prev, items: objs, filtered: objs,}));
    } catch (error) {
      setState(prev => ({ ...prev, message: `Error obteniendo Venta: ${error}` }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCreate = async (data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.create(data);
      if (!response){
        throw Error(`Error creando Venta`);
      }
      setState(prev => ({ ...prev, message: "Venta creado"}));
      await loadItems();
    } catch (error) {
      throw Error(`Error creando Venta: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.update(id, data);
      if (!response){
        throw Error(`Error actualizando Venta`);
      }
      setState(prev => ({ ...prev, message: "Venta actualizado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error actualizando Venta: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.delete(id);
      if (!response){
        throw Error(`Error eliminando Venta`);
      }
      setState(prev => ({ ...prev, message: "Venta eliminado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error eliminando Venta: ${error}`);
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
    const filtered = state.items.filter((item: VentaEntity) => {
      return item.id?.toString().toLowerCase().includes(lower) ||
item.carrito?.toString().toLowerCase().includes(lower) ||
item.pago?.toString().toLowerCase().includes(lower);
    });
    setState(prev => ({ ...prev, filtered: filtered }));
  };

  useEffect(() => {
    loadItems();
  }, []);
  return { ...state, handleCreate, handleUpdate, handleDelete, handleSearch };
};

