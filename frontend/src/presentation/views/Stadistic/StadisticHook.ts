// StadisticHook.ts
import { useState, useEffect } from 'react';
import { StatsUseCase } from '../../../application/usecases/Stats_uc';
import { APIGateway } from '../../../infraestructure/services/APIGateway';
import type { DashboardStats } from './Stadistic';

export interface ProductoPrediction {
  producto_id: number;
  producto_nombre: string;
  producto_precio: number;
  categoria: string;
  stock_actual: number;
  prediccion_ventas: number; // Cantidad de unidades
  monto_estimado: number;
  confianza: string; // 'alta' | 'media' | 'baja'
  fecha_prediccion: string;
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [productoPredictions, setProductoPredictions] = useState<ProductoPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats_uc = new StatsUseCase(new APIGateway());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, predictionsData] = await Promise.all([
          stats_uc.get_stats(),
          stats_uc.get_predictions()
        ]);
        
        setStats(statsData);
        setProductoPredictions(predictionsData);
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  const refreshData = async () => {
    try {
      setLoading(true);
      const [statsData, predictionsData] = await Promise.all([
        stats_uc.get_stats(),
        stats_uc.get_predictions(),
      ]);
      
      setStats(statsData);
      setProductoPredictions(predictionsData);
    } catch (err) {
      setError('Error al actualizar los datos');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    productoPredictions, // Cambiamos de predictions a productoPredictions
    loading,
    error,
    refreshData, // Exportamos para uso específico
  };
};