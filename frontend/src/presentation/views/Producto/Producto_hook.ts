import { useState, useEffect } from 'react';
import { ProductoUseCase } from '../../../application/usecases/Producto_uc';
import { ProductoEntity } from '../../../domain/entities/Producto_entity';
import { APIGateway } from '../../../infraestructure/services/APIGateway';

type ProductoHookProps = {
  items: ProductoEntity[],
  loading: boolean,
  message: string,
  filtered: ProductoEntity[],
};

export const ProductoHook = () => {
  const [state, setState] = useState<ProductoHookProps>({
    items: [],
    loading: false,
    message: '',
    filtered: [],
  });
  const uc = new ProductoUseCase(new APIGateway());
  const loadItems = async () => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.get();
      if (!response){
        throw Error(`Error obteniendo Producto`);
      }
        const objs = response;
        setState(prev => ({ ...prev, items: objs, filtered: objs,}));
    } catch (error) {
      setState(prev => ({ ...prev, message: `Error obteniendo Producto: ${error}` }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCreate = async (data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.create(data);
      if (!response){
        throw Error(`Error creando Producto`);
      }
      setState(prev => ({ ...prev, message: "Producto creado"}));
      await loadItems();
    } catch (error) {
      throw Error(`Error creando Producto: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.update(id, data);
      if (!response){
        throw Error(`Error actualizando Producto`);
      }
      setState(prev => ({ ...prev, message: "Producto actualizado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error actualizando Producto: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, message: '' }));
    try {
      const response = await uc.delete(id);
      if (!response){
        throw Error(`Error eliminando Producto`);
      }
      setState(prev => ({ ...prev, message: "Producto eliminado",}));
      await loadItems();
    } catch (error) {
      throw Error(`Error eliminando Producto: ${error}`);
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
    const filtered = state.items.filter((item: ProductoEntity) => {
      return item.id?.toString().toLowerCase().includes(lower) ||
item.nombre?.toString().toLowerCase().includes(lower) ||
item.marca?.toString().toLowerCase().includes(lower);
    });
    setState(prev => ({ ...prev, filtered: filtered }));
  };

  useEffect(() => {
    loadItems();
  }, []);
  return { ...state, handleCreate, handleUpdate, handleDelete, handleSearch };
};

