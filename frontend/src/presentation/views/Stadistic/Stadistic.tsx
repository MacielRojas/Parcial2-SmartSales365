import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Card, Badge } from 'react-bootstrap';
import { StatsCards } from '../../components/chart/StatsChart';
import { SalesChart } from '../../components/chart/SalesChart';
import { CategoryChart } from '../../components/chart/CategoryChart';
import { TopProducts } from './ProductosPopulares';
import { useDashboardData } from './StadisticHook';
import Loading from '../../components/loading';
import { ProductPredictionsTable } from './PrediccionesProducto';

export interface DashboardStats {
  total_ventas: number;
  total_usuarios: number;
  total_productos: number;
  ventas_mes_actual: number;
  crecimiento_ventas: number;
  productos_populares: Array<{
    producto: string;
    ventas: number;
  }>;
  ventas_por_categoria: Array<{
    categoria: string;
    ventas: number;
  }>;
  ventas_por_mes: Array<{
    mes: string;
    ventas: number;
  }>;
}

// NUEVA INTERFACE PARA PREDICCIONES POR PRODUCTO
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

// Interface legacy para compatibilidad (puedes eliminarla luego)
export interface LegacyPredictionData {
  producto_id: number;
  producto_nombre: string;
  prediccion_ventas: number;
  confianza: number;
  fecha_prediccion: string;
}

// Función helper para extraer valores numéricos de objetos
const extractNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'object' && value !== null) {
    return value.count || value.value || value.total || 0;
  }
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
};

// Función helper para extraer strings
const extractString = (value: any): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    return value.nombre || value.name || value.producto || JSON.stringify(value);
  }
  return String(value);
};

export const StadisticView: React.FC = () => {
  const { stats, productoPredictions, loading, error, refreshData } = useDashboardData();
  const [salesData, setSalesData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any>(null);

  // Procesar los datos para asegurar que sean del tipo correcto
  const processedStats = React.useMemo(() => {
    if (!stats) return null;

    return {
      total_ventas: extractNumber(stats.total_ventas),
      total_usuarios: extractNumber(stats.total_usuarios),
      total_productos: extractNumber(stats.total_productos),
      ventas_mes_actual: extractNumber(stats.ventas_mes_actual),
      crecimiento_ventas: extractNumber(stats.crecimiento_ventas),
      productos_populares: (stats.productos_populares || []).map((item: any) => ({
        producto: extractString(item.producto),
        ventas: extractNumber(item.ventas)
      })),
      ventas_por_categoria: (stats.ventas_por_categoria || []).map((item: any) => ({
        categoria: extractString(item.categoria),
        ventas: extractNumber(item.ventas)
      })),
      ventas_por_mes: (stats.ventas_por_mes || []).map((item: any) => ({
        mes: extractString(item.mes),
        ventas: extractNumber(item.ventas)
      }))
    };
  }, [stats]);

  // Función para generar datos de meses si no existen
  const getMonthlyData = () => {
    if (processedStats?.ventas_por_mes && processedStats.ventas_por_mes.length > 0) {
      return processedStats.ventas_por_mes;
    }
    
    // Datos por defecto si no hay ventas_por_mes
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const totalVentas = processedStats?.total_ventas || 0;
    
    // Distribución típica de ventas mensuales
    const distribucion = [0.06, 0.05, 0.07, 0.08, 0.09, 0.10, 0.09, 0.10, 0.11, 0.12, 0.07, 0.06];
    
    return meses.map((mes, index) => ({
      mes,
      ventas: Math.round(totalVentas * distribucion[index])
    }));
  };

  // Función para generar predicciones de ejemplo si no hay reales
  const generateExamplePredictions = (): ProductoPrediction[] => {
    if (!processedStats) return [];

    // Si hay productos populares, usarlos como base
    if (processedStats.productos_populares && processedStats.productos_populares.length > 0) {
      // return processedStats.productos_populares.slice(0, 8).map((producto, index) => ({
      return processedStats.productos_populares.slice(0, 8).map((producto, index) => ({
        producto_id: index + 1,
        producto_nombre: producto.producto,
        producto_precio: 100 + (index * 50), // Precio ejemplo
        categoria: `Categoría ${(index % 3) + 1}`,
        stock_actual: 20 - index,
        prediccion_ventas: producto.ventas * (0.8 + Math.random() * 0.4), // Basado en ventas históricas
        monto_estimado: (producto.ventas * (0.8 + Math.random() * 0.4)) * (100 + (index * 50)),
        confianza: ['alta', 'media', 'baja'][index % 3] as 'alta' | 'media' | 'baja',
        fecha_prediccion: new Date().toISOString()
      }));
    }

    // Predicciones de ejemplo genéricas
    return [
      {
        producto_id: 1,
        producto_nombre: 'Producto Ejemplo 1',
        producto_precio: 150,
        categoria: 'Electrónicos',
        stock_actual: 15,
        prediccion_ventas: 25,
        monto_estimado: 3750,
        confianza: 'alta',
        fecha_prediccion: new Date().toISOString()
      },
      {
        producto_id: 2,
        producto_nombre: 'Producto Ejemplo 2',
        producto_precio: 200,
        categoria: 'Hogar',
        stock_actual: 8,
        prediccion_ventas: 18,
        monto_estimado: 3600,
        confianza: 'media',
        fecha_prediccion: new Date().toISOString()
      },
      {
        producto_id: 3,
        producto_nombre: 'Producto Ejemplo 3',
        producto_precio: 75,
        categoria: 'Deportes',
        stock_actual: 25,
        prediccion_ventas: 35,
        monto_estimado: 2625,
        confianza: 'alta',
        fecha_prediccion: new Date().toISOString()
      }
    ];
  };

  // Usar predicciones reales o generar ejemplos
  const displayPredictions = productoPredictions && productoPredictions.length > 0 
    ? productoPredictions 
    : generateExamplePredictions();

  useEffect(() => {
    if (processedStats) {
      const monthlyData = getMonthlyData();
      
      // Preparar datos para el gráfico de ventas
      const salesChartData = {
        labels: monthlyData.map(mes => mes.mes),
        datasets: [
          {
            label: `Ventas ${new Date().getFullYear()}`,
            data: monthlyData.map(mes => mes.ventas),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            fill: true,
          },
        ],
      };

      // Preparar datos para el gráfico de categorías
      const categoryChartData = {
        labels: processedStats.ventas_por_categoria.map(cat => cat.categoria),
        datasets: [
          {
            data: processedStats.ventas_por_categoria.map(cat => cat.ventas),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#FF6384',
              '#36A2EB',
            ],
            borderColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#FF6384',
              '#36A2EB',
            ],
            borderWidth: 1,
          },
        ],
      };

      setSalesData(salesChartData);
      setCategoryData(categoryChartData);
    }
  }, [processedStats]);

  // Función para formatear números como moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!processedStats) {
    return (
      <Container fluid>
        <Alert variant="warning" className="mt-3">
          No se pudieron cargar los datos del dashboard.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Dashboard de Ventas</h1>
          <p className="text-muted mb-0">Estadísticas y predicciones en tiempo real</p>
        </div>
        <Button variant="primary" onClick={refreshData}>
          <i className="fas fa-sync-alt me-2"></i>
          Actualizar
        </Button>
      </div>

      <StatsCards stats={processedStats} />

      <Row className="g-3 mb-4">
        <Col lg={8}>
          {salesData && <SalesChart data={salesData} />}
        </Col>
        <Col lg={4}>
          {categoryData && <CategoryChart data={categoryData} />}
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col lg={6}>
          <TopProducts stats={processedStats} />
        </Col>
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Resumen por Categorías</h5>
            </Card.Header>
            <Card.Body>
              {processedStats.ventas_por_categoria.map((categoria, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                  <span>{categoria.categoria}</span>
                  <Badge bg="primary">
                    {formatCurrency(categoria.ventas)}
                  </Badge>
                </div>
              ))}
              {processedStats.ventas_por_categoria.length === 0 && (
                <div className="text-center text-muted">
                  No hay datos de categorías disponibles
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col xs={12}>
          {/* USAR EL NUEVO COMPONENTE DE PREDICCIONES POR PRODUCTO */}
          <ProductPredictionsTable
            predictions={displayPredictions} 
            onRefresh={refreshData}
            loading={loading}
          />
        </Col>
      </Row>
    </Container>
  );
};