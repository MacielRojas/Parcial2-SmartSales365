import { useState, useEffect } from 'react';
import { MantenimientoUseCase } from '../../../application/usecases/Mantenimiento_uc';
import { MantenimientoEntity } from '../../../domain/entities/Mantenimiento_entity';
import { APIGateway } from '../../../infraestructure/services/APIGateway';

type MantenimientoHookProps = {
  items: MantenimientoEntity[],
  loading: boolean,
  message: string,
  filtered: MantenimientoEntity[],
};

export const MantenimientoHook = () => {
  const [state, setState] = useState<MantenimientoHookProps>({
    items: [],
    loading: false,
    message: '',
    filtered: [],
  });
  const uc = new MantenimientoUseCase(new APIGateway());
  const loadItems = async () => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.get();
      if (!response){
        throw Error(`Error obteniendo Mantenimiento`);
      }
        const objs = response;
        setState(prev => ({ ...prev, items: objs, filtered: objs,}));
    } catch (error) {
      setState(prev => ({ ...prev, message: `Error obteniendo Mantenimiento: ${error}` }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCreate = async (data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.create(data);
      if (!response){
        throw Error(`Error creando Mantenimiento`);
      }
      setState(prev => ({ ...prev, message: "Mantenimiento creado"}));
      await loadItems();
    } catch (error) {
      throw Error(`Error creando Mantenimiento: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.update(id, data);
      if (!response){
        throw Error(`Error actualizando Mantenimiento`);
      }
      setState(prev => ({ ...prev, message: "Mantenimiento actualizado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error actualizando Mantenimiento: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.delete(id);
      if (!response){
        throw Error(`Error eliminando Mantenimiento`);
      }
      setState(prev => ({ ...prev, message: "Mantenimiento eliminado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error eliminando Mantenimiento: ${error}`);
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
    const filtered = state.items.filter((item: MantenimientoEntity) => {
      return item.id?.toString().toLowerCase().includes(lower) ||
item.producto?.toString().toLowerCase().includes(lower) ||
item.precio?.toString().toLowerCase().includes(lower) ||
item.fecha_programada?.toString().toLowerCase().includes(lower) ||
item.estado?.toString().toLowerCase().includes(lower) ||
item.usuario?.toString().toLowerCase().includes(lower);
    });
    setState(prev => ({ ...prev, filtered: filtered }));
  };

  useEffect(() => {
    loadItems();
  }, []);
  return { ...state, handleCreate, handleUpdate, handleDelete, handleSearch };
};

