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

// Datos estáticos de ejemplo para demo rápida
const DATOS_ESTATICOS: DashboardStats = {
  total_ventas: 45678.90,
  total_usuarios: 156,
  total_productos: 89,
  ventas_mes_actual: 12345.67,
  crecimiento_ventas: 15.3,
  productos_populares: [
    { producto: 'Laptop Dell XPS 13', ventas: 8500 },
    { producto: 'Mouse Logitech MX Master', ventas: 3200 },
    { producto: 'Teclado Mecánico Corsair', ventas: 2800 },
    { producto: 'Monitor Samsung 27"', ventas: 6500 },
    { producto: 'Auriculares Sony WH-1000XM4', ventas: 4200 },
    { producto: 'Webcam Logitech C920', ventas: 1800 },
    { producto: 'SSD Samsung 1TB', ventas: 3500 },
    { producto: 'RAM Corsair 16GB', ventas: 2900 }
  ],
  ventas_por_categoria: [
    { categoria: 'Electrónicos', ventas: 18500 },
    { categoria: 'Computadoras', ventas: 15200 },
    { categoria: 'Accesorios', ventas: 8900 },
    { categoria: 'Audio', ventas: 4200 }
  ],
  ventas_por_mes: [
    { mes: 'Ene', ventas: 2800 },
    { mes: 'Feb', ventas: 2400 },
    { mes: 'Mar', ventas: 3200 },
    { mes: 'Abr', ventas: 3800 },
    { mes: 'May', ventas: 4200 },
    { mes: 'Jun', ventas: 4800 },
    { mes: 'Jul', ventas: 4500 },
    { mes: 'Ago', ventas: 4900 },
    { mes: 'Sep', ventas: 5200 },
    { mes: 'Oct', ventas: 5800 },
    { mes: 'Nov', ventas: 3400 },
    { mes: 'Dic', ventas: 2900 }
  ]
};

const PREDICCIONES_ESTATICAS: ProductoPrediction[] = [
  {
    producto_id: 1,
    producto_nombre: 'Laptop Dell XPS 13',
    producto_precio: 1299.99,
    categoria: 'Computadoras',
    stock_actual: 15,
    prediccion_ventas: 28,
    monto_estimado: 36399.72,
    confianza: 'alta',
    fecha_prediccion: new Date().toISOString()
  },
  {
    producto_id: 2,
    producto_nombre: 'Monitor Samsung 27"',
    producto_precio: 349.99,
    categoria: 'Accesorios',
    stock_actual: 22,
    prediccion_ventas: 35,
    monto_estimado: 12249.65,
    confianza: 'alta',
    fecha_prediccion: new Date().toISOString()
  },
  {
    producto_id: 3,
    producto_nombre: 'Auriculares Sony WH-1000XM4',
    producto_precio: 299.99,
    categoria: 'Audio',
    stock_actual: 18,
    prediccion_ventas: 22,
    monto_estimado: 6599.78,
    confianza: 'media',
    fecha_prediccion: new Date().toISOString()
  }
];

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
        
        // Intentar cargar del backend, pero usar datos estáticos como fallback
        try {
          const [statsData, predictionsData] = await Promise.all([
            stats_uc.get_stats(),
            stats_uc.get_predictions()
          ]);
          
          setStats(statsData);
          setProductoPredictions(predictionsData);
        } catch (backendError) {
          console.log('⚠️ Backend no disponible, usando datos estáticos de demostración');
          // Usar datos estáticos
          setStats(DATOS_ESTATICOS);
          setProductoPredictions(PREDICCIONES_ESTATICAS);
        }
        
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        console.error('Error fetching dashboard data:', err);
        // Incluso en caso de error, usar datos estáticos
        setStats(DATOS_ESTATICOS);
        setProductoPredictions(PREDICCIONES_ESTATICAS);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  const refreshData = async () => {
    try {
      setLoading(true);
      
      try {
        const [statsData, predictionsData] = await Promise.all([
          stats_uc.get_stats(),
          stats_uc.get_predictions(),
        ]);
        
        setStats(statsData);
        setProductoPredictions(predictionsData);
      } catch (backendError) {
        console.log('⚠️ Backend no disponible, usando datos estáticos de demostración');
        setStats(DATOS_ESTATICOS);
        setProductoPredictions(PREDICCIONES_ESTATICAS);
      }
      
    } catch (err) {
      setError('Error al actualizar los datos');
      // Usar datos estáticos como último recurso
      setStats(DATOS_ESTATICOS);
      setProductoPredictions(PREDICCIONES_ESTATICAS);
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