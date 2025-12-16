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

// Datos estáticos de ejemplo
const BITACORA_ESTATICA: BitacoraEntity[] = [
  {
    id: 1,
    usuario: 1,
    accion: 'Inicio de sesión exitoso',
    ipv4: '192.168.1.100',
    nivel: 'INFO',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 2,
    usuario: 2,
    accion: 'Creación de producto: Laptop Dell XPS 13',
    ipv4: '192.168.1.105',
    nivel: 'SUCCESS',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: 3,
    usuario: 1,
    accion: 'Intento de acceso no autorizado',
    ipv4: '192.168.1.200',
    nivel: 'WARNING',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
  {
    id: 4,
    usuario: 3,
    accion: 'Error al procesar pago',
    ipv4: '192.168.1.150',
    nivel: 'ERROR',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 5,
    usuario: 2,
    accion: 'Actualización de inventario completada',
    ipv4: '192.168.1.105',
    nivel: 'SUCCESS',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 6,
    usuario: 1,
    accion: 'Generación de reporte de ventas',
    ipv4: '192.168.1.100',
    nivel: 'INFO',
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 240).toISOString()
  },
  {
    id: 7,
    usuario: 4,
    accion: 'Backup de base de datos iniciado',
    ipv4: '10.0.0.1',
    nivel: 'INFO',
    created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 300).toISOString()
  },
  {
    id: 8,
    usuario: 3,
    accion: 'Eliminación de producto obsoleto',
    ipv4: '192.168.1.150',
    nivel: 'WARNING',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 360).toISOString()
  }
];

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
      console.log('⚠️ Backend no disponible, usando bitácora estática');
      // Usar datos estáticos como fallback
      setState(prev => ({ 
        ...prev, 
        items: BITACORA_ESTATICA, 
        filtered: BITACORA_ESTATICA,
        message: 'Mostrando datos de demostración'
      }));
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

