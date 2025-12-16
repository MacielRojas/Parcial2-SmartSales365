import { useState, useEffect } from 'react';
import { PagoUseCase } from '../../../application/usecases/Pago_uc';
import { PagoEntity } from '../../../domain/entities/Pago_entity';
import { APIGateway } from '../../../infraestructure/services/APIGateway';

type PagoHookProps = {
  items: PagoEntity[],
  loading: boolean,
  message: string,
  filtered: PagoEntity[],
};

export const PagoHook = () => {
  const [state, setState] = useState<PagoHookProps>({
    items: [],
    loading: false,
    message: '',
    filtered: [],
  });
  const uc = new PagoUseCase(new APIGateway());
  const loadItems = async () => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.get();
      if (!response){
        throw Error(`Error obteniendo Pago`);
      }
        const objs = response;
        setState(prev => ({ ...prev, items: objs, filtered: objs,}));
    } catch (error) {
      setState(prev => ({ ...prev, message: `Error obteniendo Pago: ${error}` }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCreate = async (data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.create(data);
      if (!response){
        throw Error(`Error creando Pago`);
      }
      setState(prev => ({ ...prev, message: "Pago creado"}));
      await loadItems();
    } catch (error) {
      throw Error(`Error creando Pago: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.update(id, data);
      if (!response){
        throw Error(`Error actualizando Pago`);
      }
      setState(prev => ({ ...prev, message: "Pago actualizado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error actualizando Pago: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.delete(id);
      if (!response){
        throw Error(`Error eliminando Pago`);
      }
      setState(prev => ({ ...prev, message: "Pago eliminado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error eliminando Pago: ${error}`);
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
    const filtered = state.items.filter((item: PagoEntity) => {
      return item.id?.toString().toLowerCase().includes(lower) ||
item.monto?.toString().toLowerCase().includes(lower) ||
item.moneda?.toString().toLowerCase().includes(lower) ||
item.estado?.toString().toLowerCase().includes(lower) ||
item.carrito?.toString().toLowerCase().includes(lower) ||
item.payment_method_id?.toString().toLowerCase().includes(lower) ||
item.payment_intent?.toString().toLowerCase().includes(lower);
    });
    setState(prev => ({ ...prev, filtered: filtered }));
  };

  useEffect(() => {
    loadItems();
  }, []);
  return { ...state, handleCreate, handleUpdate, handleDelete, handleSearch };
};

