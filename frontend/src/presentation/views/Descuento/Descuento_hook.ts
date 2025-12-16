import { useState, useEffect } from 'react';
import { DescuentoUseCase } from '../../../application/usecases/Descuento_uc';
import { DescuentoEntity } from '../../../domain/entities/Descuento_entity';
import { APIGateway } from '../../../infraestructure/services/APIGateway';

type DescuentoHookProps = {
  items: DescuentoEntity[],
  loading: boolean,
  message: string,
  filtered: DescuentoEntity[],
};

export const DescuentoHook = () => {
  const [state, setState] = useState<DescuentoHookProps>({
    items: [],
    loading: false,
    message: '',
    filtered: [],
  });
  const uc = new DescuentoUseCase(new APIGateway());
  const loadItems = async () => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.get();
      if (!response){
        throw Error(`Error obteniendo Descuento`);
      }
        const objs = response;
        setState(prev => ({ ...prev, items: objs, filtered: objs,}));
    } catch (error) {
      setState(prev => ({ ...prev, message: `Error obteniendo Descuento: ${error}` }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCreate = async (data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.create(data);
      if (!response){
        throw Error(`Error creando Descuento`);
      }
      setState(prev => ({ ...prev, message: "Descuento creado"}));
      await loadItems();
    } catch (error) {
      throw Error(`Error creando Descuento: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.update(id, data);
      if (!response){
        throw Error(`Error actualizando Descuento`);
      }
      setState(prev => ({ ...prev, message: "Descuento actualizado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error actualizando Descuento: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.delete(id);
      if (!response){
        throw Error(`Error eliminando Descuento`);
      }
      setState(prev => ({ ...prev, message: "Descuento eliminado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error eliminando Descuento: ${error}`);
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
    const filtered = state.items.filter((item: DescuentoEntity) => {
      return item.id?.toString().toLowerCase().includes(lower) ||
item.tipo?.toString().toLowerCase().includes(lower) ||
item.producto?.toString().toLowerCase().includes(lower) ||
item.valor?.toString().toLowerCase().includes(lower) ||
item.fecha_inicio?.toString().toLowerCase().includes(lower) ||
item.fecha_fin?.toString().toLowerCase().includes(lower);
    });
    setState(prev => ({ ...prev, filtered: filtered }));
  };

  useEffect(() => {
    loadItems();
  }, []);
  return { ...state, handleCreate, handleUpdate, handleDelete, handleSearch };
};

