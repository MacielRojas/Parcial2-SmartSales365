import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Card, Badge, Spinner } from 'react-bootstrap';
import { StatsCards } from '../../components/chart/StatsChart';
import { SalesChart } from '../../components/chart/SalesChart';
import { CategoryChart } from '../../components/chart/CategoryChart';
import { TopProducts } from './ProductosPopulares';
import { useDashboardData } from './StadisticHook';
import Loading from '../../components/loading';
import { ProductPredictionsTable } from './PrediccionesProducto';
import { 
  simularVentas, 
  calcularEstadisticas, 
  obtenerAnalisisIA,
  type EstadisticaVentas,
  type AnalisisIA,
  type VentaSimulada
} from '../../../services/estadisticasService';

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
  
  // Estados para ventas simuladas y análisis IA
  const [ventasSimuladas, setVentasSimuladas] = useState<VentaSimulada[]>([]);
  const [estadisticasVentas, setEstadisticasVentas] = useState<EstadisticaVentas | null>(null);
  const [analisisIA, setAnalisisIA] = useState<AnalisisIA | null>(null);
  const [cargandoAnalisis, setCargandoAnalisis] = useState(false);
  
  // Estados para Text-to-Speech
  const [leyendo, setLeyendo] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [vozDisponible, setVozDisponible] = useState(false);

  // Verificar disponibilidad de Text-to-Speech
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setVozDisponible(true);
      // Cargar voces (algunas veces se cargan de forma asíncrona)
      const cargarVoces = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('🔊 Voces disponibles:', voices.length);
      };
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = cargarVoces;
      }
      cargarVoces();
    }    
    // Cleanup: detener cualquier lectura cuando el componente se desmonte
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };  }, []);

  // Función para convertir el análisis en texto narrativo
  const generarTextoNarrativo = (): string => {
    if (!analisisIA || !estadisticasVentas) return '';

    let texto = 'Resumen ejecutivo de análisis de ventas. ';
    
    // Resumen general
    if (analisisIA.resumen_ejecutivo) {
      texto += `Resumen general: ${analisisIA.resumen_ejecutivo}. `;
    }
    
    // Estadísticas clave
    texto += `Las ventas totales son de ${estadisticasVentas.total_ventas_periodo.toFixed(2)} con un total de ${estadisticasVentas.cantidad_transacciones} transacciones. `;
    texto += `El ticket promedio es de ${estadisticasVentas.ticket_promedio.toFixed(2)}. `;
    
    if (estadisticasVentas.tendencia) {
      const tendenciaTexto = estadisticasVentas.tendencia === 'creciente' ? 'crecimiento' : 
                             estadisticasVentas.tendencia === 'decreciente' ? 'decrecimiento' : 'estabilidad';
      texto += `La tendencia actual es de ${tendenciaTexto}. `;
    }
    
    // Insights principales
    if (analisisIA.insights_principales && analisisIA.insights_principales.length > 0) {
      texto += 'Principales insights: ';
      analisisIA.insights_principales.forEach((insight: string, index: number) => {
        texto += `${index + 1}. ${insight}. `;
      });
    }
    
    // Recomendaciones
    if (analisisIA.recomendaciones && analisisIA.recomendaciones.length > 0) {
      texto += 'Recomendaciones: ';
      analisisIA.recomendaciones.forEach((rec, index) => {
        texto += `${index + 1}. ${rec}. `;
      });
    }
    
    // Predicciones
    if (analisisIA.predicciones && analisisIA.predicciones.length > 0) {
      texto += 'Predicciones: ';
      analisisIA.predicciones.forEach((pred, index) => {
        texto += `${index + 1}. ${pred}. `;
      });
    }
    
    // Alertas
    if (analisisIA.alertas && analisisIA.alertas.length > 0) {
      texto += 'Alertas importantes: ';
      analisisIA.alertas.forEach((alerta, index) => {
        texto += `${index + 1}. ${alerta}. `;
      });
    }
    
    // Oportunidades
    if (analisisIA.oportunidades && analisisIA.oportunidades.length > 0) {
      texto += 'Oportunidades detectadas: ';
      analisisIA.oportunidades.forEach((oportunidad, index) => {
        texto += `${index + 1}. ${oportunidad}. `;
      });
    }
    
    // Conclusión final
    texto += 'Conclusión. ';
    
    const tendenciaPositiva = estadisticasVentas.tendencia === 'creciente';
    const tiendeAlertas = analisisIA.alertas && analisisIA.alertas.length > 0;
    const tieneOportunidades = analisisIA.oportunidades && analisisIA.oportunidades.length > 0;
    
    if (tendenciaPositiva && !tiendeAlertas) {
      texto += `Los resultados del análisis muestran un panorama favorable con ${estadisticasVentas.cantidad_transacciones} transacciones completadas y una tendencia de crecimiento sostenido. `;
      if (tieneOportunidades) {
        texto += 'Se han identificado múltiples oportunidades de expansión que podrían impulsar aún más el rendimiento. ';
      }
      texto += 'Se recomienda mantener las estrategias actuales y capitalizar las oportunidades detectadas. ';
    } else if (tendenciaPositiva && tiendeAlertas) {
      texto += `A pesar de la tendencia de crecimiento con ${estadisticasVentas.cantidad_transacciones} transacciones, existen áreas críticas que requieren atención inmediata. `;
      texto += 'Es fundamental abordar las alertas identificadas para no comprometer el crecimiento futuro. ';
    } else if (!tendenciaPositiva && tiendeAlertas) {
      texto += `Los datos revelan desafíos importantes con una tendencia de ${estadisticasVentas.tendencia === 'decreciente' ? 'decrecimiento' : 'estabilidad'}. `;
      texto += 'Se requiere acción inmediata sobre las alertas críticas y considerar las recomendaciones estratégicas proporcionadas. ';
    } else {
      texto += `Con ${estadisticasVentas.cantidad_transacciones} transacciones en el período analizado y un ticket promedio de ${estadisticasVentas.ticket_promedio.toFixed(2)}, `;
      texto += 'el negocio muestra potencial de optimización mediante la implementación de las recomendaciones sugeridas. ';
    }
    
    // Mensaje de cierre
    texto += `El producto más vendido, ${estadisticasVentas.producto_mas_vendido.nombre}, ha generado ${estadisticasVentas.producto_mas_vendido.cantidad} unidades de venta, `;
    texto += `mientras que la categoría líder ${estadisticasVentas.categoria_mas_vendida.nombre} representa un componente clave del portafolio. `;
    texto += 'Este análisis proporciona las bases para tomar decisiones informadas y estratégicas. ';
    texto += 'Gracias por utilizar el sistema de análisis inteligente de SmartSales 365. Fin del resumen ejecutivo.';
    
    return texto;
  };

  // Función para leer el análisis con Text-to-Speech
  const leerAnalisis = () => {
    if (!vozDisponible || !analisisIA) {
      alert('La funcionalidad de voz no está disponible o no hay análisis generado.');
      return;
    }

    // Cancelar cualquier lectura en curso
    window.speechSynthesis.cancel();

    const texto = generarTextoNarrativo();
    const utterance = new SpeechSynthesisUtterance(texto);
    
    // Configurar voz en español
    const voices = window.speechSynthesis.getVoices();
    const vozEspanol = voices.find(voice => 
      voice.lang.startsWith('es-') || voice.lang === 'es'
    );
    
    if (vozEspanol) {
      utterance.voice = vozEspanol;
      console.log('🔊 Usando voz:', vozEspanol.name);
    } else {
      console.log('⚠️ No se encontró voz en español, usando voz predeterminada');
    }
    
    // Configuración de la voz
    utterance.lang = 'es-ES';
    utterance.rate = 0.9; // Velocidad (0.1 a 10)
    utterance.pitch = 1.0; // Tono (0 a 2)
    utterance.volume = 1.0; // Volumen (0 a 1)
    
    // Eventos
    utterance.onstart = () => {
      setLeyendo(true);
      setPausado(false);
      console.log('🔊 Iniciando lectura...');
    };
    
    utterance.onend = () => {
      setLeyendo(false);
      setPausado(false);
      console.log('✅ Lectura completada');
    };
    
    utterance.onerror = (event) => {
      console.error('❌ Error en Text-to-Speech:', event);
      setLeyendo(false);
      setPausado(false);
    };
    
    // Iniciar lectura
    window.speechSynthesis.speak(utterance);
  };

  // Función para pausar/reanudar la lectura
  const togglePausaLectura = () => {
    if (pausado) {
      window.speechSynthesis.resume();
      setPausado(false);
    } else {
      window.speechSynthesis.pause();
      setPausado(true);
    }
  };

  // Función para detener la lectura
  const detenerLectura = () => {
    window.speechSynthesis.cancel();
    setLeyendo(false);
    setPausado(false);
  };

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

  // Cargar productos destacados y generar estadísticas
  useEffect(() => {
    const cargarProductosDestacados = async () => {
      // Productos estáticos para demostración
      const productosEstaticos = [
        { id: 1, nombre: 'Laptop Dell XPS 13', precio: 1299.99, stock: 15, categoria_nombre: 'Computadoras' },
        { id: 2, nombre: 'Mouse Logitech MX Master', precio: 79.99, stock: 45, categoria_nombre: 'Accesorios' },
        { id: 3, nombre: 'Teclado Mecánico Corsair', precio: 149.99, stock: 32, categoria_nombre: 'Accesorios' },
        { id: 4, nombre: 'Monitor Samsung 27"', precio: 349.99, stock: 22, categoria_nombre: 'Monitores' },
        { id: 5, nombre: 'Auriculares Sony WH-1000XM4', precio: 299.99, stock: 18, categoria_nombre: 'Audio' },
        { id: 6, nombre: 'Webcam Logitech C920', precio: 89.99, stock: 28, categoria_nombre: 'Accesorios' },
        { id: 7, nombre: 'SSD Samsung 1TB', precio: 129.99, stock: 40, categoria_nombre: 'Almacenamiento' },
        { id: 8, nombre: 'RAM Corsair 16GB', precio: 89.99, stock: 35, categoria_nombre: 'Componentes' }
      ];
      
      try {
        // Intentar cargar del backend primero
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${apiUrl}/especiales/productos/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        let destacados = productosEstaticos;
        
        if (response.ok) {
          const productos = await response.json();
          destacados = productos.filter((p: any) => p.stock > 0);
          console.log('✅ Productos cargados del backend:', destacados.length);
        } else {
          console.log('⚠️ Usando productos estáticos de demostración');
        }
        
        // Simular ventas basadas en productos
        const ventas = simularVentas(destacados);
        setVentasSimuladas(ventas);
        
        // Calcular estadísticas
        const estadisticas = calcularEstadisticas(ventas);
        setEstadisticasVentas(estadisticas);
        
      } catch (error) {
        console.log('⚠️ Backend no disponible, usando productos estáticos');
        // Usar datos estáticos en caso de error
        const ventas = simularVentas(productosEstaticos);
        setVentasSimuladas(ventas);
        
        const estadisticas = calcularEstadisticas(ventas);
        setEstadisticasVentas(estadisticas);
      }
    };

    cargarProductosDestacados();
  }, []);

  // Función para activar análisis de IA manualmente
  const activarAnalisisIA = async () => {
    if (estadisticasVentas && ventasSimuladas.length > 0) {
      setCargandoAnalisis(true);
      try {
        const analisis = await obtenerAnalisisIA(estadisticasVentas, ventasSimuladas);
        setAnalisisIA(analisis);
      } catch (error) {
        console.error('Error al obtener análisis IA:', error);
        alert('Error al generar análisis con IA. Verifica tu API Key de OpenAI.');
      } finally {
        setCargandoAnalisis(false);
      }
    }
  };

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
      {/* Header con título y botón de actualizar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">
            <i className="fas fa-chart-line me-2 text-primary"></i>
            Dashboard de Ventas Inteligente
          </h1>
          <p className="text-muted mb-0">
            Estadísticas en tiempo real con análisis de IA
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => {
            refreshData();
            setAnalisisIA(null); // Resetear análisis para que se regenere
          }}
          disabled={loading || cargandoAnalisis}
        >
          <i className="fas fa-sync-alt me-2"></i>
          Actualizar
        </Button>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <StatsCards stats={processedStats} />

      {/* NUEVA SECCIÓN: Estadísticas de Ventas Simuladas */}
      {estadisticasVentas && (
        <Row className="g-3 mb-4">
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-success bg-opacity-10 rounded-3 p-3">
                      <i className="fas fa-dollar-sign fa-2x text-success"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Total Ventas (30 días)</h6>
                    <h3 className="mb-0">${estadisticasVentas.total_ventas_periodo.toFixed(2)}</h3>
                    <small className={`badge ${estadisticasVentas.tendencia === 'creciente' ? 'bg-success' : estadisticasVentas.tendencia === 'decreciente' ? 'bg-danger' : 'bg-secondary'}`}>
                      <i className={`fas fa-arrow-${estadisticasVentas.tendencia === 'creciente' ? 'up' : estadisticasVentas.tendencia === 'decreciente' ? 'down' : 'right'} me-1`}></i>
                      {estadisticasVentas.comparacion_periodo_anterior > 0 ? '+' : ''}{estadisticasVentas.comparacion_periodo_anterior}%
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-info bg-opacity-10 rounded-3 p-3">
                      <i className="fas fa-receipt fa-2x text-info"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Transacciones</h6>
                    <h3 className="mb-0">{estadisticasVentas.cantidad_transacciones}</h3>
                    <small className="text-muted">
                      Ticket: ${estadisticasVentas.ticket_promedio.toFixed(2)}
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-warning bg-opacity-10 rounded-3 p-3">
                      <i className="fas fa-trophy fa-2x text-warning"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Producto Líder</h6>
                    <h6 className="mb-0 text-truncate" title={estadisticasVentas.producto_mas_vendido.nombre}>
                      {estadisticasVentas.producto_mas_vendido.nombre}
                    </h6>
                    <small className="text-muted">
                      {estadisticasVentas.producto_mas_vendido.cantidad} unidades
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-primary bg-opacity-10 rounded-3 p-3">
                      <i className="fas fa-tags fa-2x text-primary"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Categoría Top</h6>
                    <h6 className="mb-0">{estadisticasVentas.categoria_mas_vendida.nombre}</h6>
                    <small className="text-muted">
                      ${estadisticasVentas.categoria_mas_vendida.total.toFixed(2)}
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Botón para activar análisis IA */}
      {!analisisIA && !cargandoAnalisis && estadisticasVentas && (
        <Card className="mb-4 border-0 shadow-sm text-center">
          <Card.Body className="py-5">
            <div className="mb-3">
              <i className="fas fa-robot fa-4x text-primary mb-3"></i>
              <h4>Análisis Inteligente con IA</h4>
              <p className="text-muted mb-4">
                Obtén insights, recomendaciones y predicciones generadas por inteligencia artificial
                basadas en tus datos de ventas.
              </p>
            </div>
            <Button 
              variant="primary" 
              size="lg"
              onClick={activarAnalisisIA}
              className="px-5"
            >
              <i className="fas fa-brain me-2"></i>
              Generar Análisis con IA
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Indicador de carga para análisis IA */}
      {cargandoAnalisis && (
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <h5 className="text-primary">Analizando datos con IA...</h5>
            <p className="text-muted mb-0">
              Generando insights, recomendaciones y predicciones personalizadas
            </p>
          </Card.Body>
        </Card>
      )}

      {/* SECCIÓN: Análisis de IA */}
      {analisisIA && !cargandoAnalisis && (
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-gradient d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <h5 className="mb-0 text-white">
              <i className="fas fa-brain me-2"></i>
              Análisis Inteligente con IA
            </h5>
            <div className="d-flex gap-2">
              {/* Controles de Text-to-Speech */}
              {vozDisponible && (
                <>
                  {!leyendo ? (
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={leerAnalisis}
                      title="Escuchar resumen ejecutivo en audio"
                    >
                      <i className="fas fa-volume-up me-2"></i>
                      Escuchar Análisis
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="warning" 
                        size="sm"
                        onClick={togglePausaLectura}
                        title={pausado ? "Reanudar lectura" : "Pausar lectura"}
                      >
                        <i className={`fas fa-${pausado ? 'play' : 'pause'} me-2`}></i>
                        {pausado ? 'Reanudar' : 'Pausar'}
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={detenerLectura}
                        title="Detener lectura"
                      >
                        <i className="fas fa-stop me-2"></i>
                        Detener
                      </Button>
                    </>
                  )}
                </>
              )}
              
              <Button 
                variant="light" 
                size="sm"
                onClick={activarAnalisisIA}
                disabled={cargandoAnalisis}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Regenerar
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {/* Indicador de lectura activa */}
            {leyendo && (
              <Alert variant="info" className="mb-3 d-flex align-items-center">
                <div className="spinner-grow spinner-grow-sm text-info me-3" role="status">
                  <span className="visually-hidden">Leyendo...</span>
                </div>
                <div>
                  <strong>
                    <i className="fas fa-volume-up me-2"></i>
                    Reproduciendo resumen ejecutivo en audio
                  </strong>
                  <br />
                  <small>
                    {pausado ? 'En pausa - Presiona Reanudar para continuar' : 'Escuchando el análisis completo...'}
                  </small>
                </div>
              </Alert>
            )}
            
            {/* Resumen Ejecutivo */}
            <div className="mb-4">
              <h6 className="text-primary mb-2">
                <i className="fas fa-file-alt me-2"></i>Resumen Ejecutivo
              </h6>
              <p className="text-muted mb-0">{analisisIA.resumen_ejecutivo}</p>
            </div>

            <Row>
              {/* Insights Principales */}
              <Col lg={6} className="mb-3">
                <h6 className="text-success mb-3">
                  <i className="fas fa-lightbulb me-2"></i>Insights Principales
                </h6>
                <ul className="list-unstyled">
                  {analisisIA.insights_principales.map((insight, idx) => (
                    <li key={idx} className="mb-2 d-flex align-items-start">
                      <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                      <span className="text-muted">{insight}</span>
                    </li>
                  ))}
                </ul>
              </Col>

              {/* Recomendaciones */}
              <Col lg={6} className="mb-3">
                <h6 className="text-primary mb-3">
                  <i className="fas fa-thumbs-up me-2"></i>Recomendaciones
                </h6>
                <ul className="list-unstyled">
                  {analisisIA.recomendaciones.map((rec, idx) => (
                    <li key={idx} className="mb-2 d-flex align-items-start">
                      <i className="fas fa-arrow-right text-primary me-2 mt-1"></i>
                      <span className="text-muted">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Col>

              {/* Predicciones */}
              <Col lg={6} className="mb-3">
                <h6 className="text-info mb-3">
                  <i className="fas fa-crystal-ball me-2"></i>Predicciones
                </h6>
                <ul className="list-unstyled">
                  {analisisIA.predicciones.map((pred, idx) => (
                    <li key={idx} className="mb-2 d-flex align-items-start">
                      <i className="fas fa-chart-line text-info me-2 mt-1"></i>
                      <span className="text-muted">{pred}</span>
                    </li>
                  ))}
                </ul>
              </Col>

              {/* Oportunidades */}
              <Col lg={6} className="mb-3">
                <h6 className="text-warning mb-3">
                  <i className="fas fa-star me-2"></i>Oportunidades
                </h6>
                <ul className="list-unstyled">
                  {analisisIA.oportunidades.map((opp, idx) => (
                    <li key={idx} className="mb-2 d-flex align-items-start">
                      <i className="fas fa-rocket text-warning me-2 mt-1"></i>
                      <span className="text-muted">{opp}</span>
                    </li>
                  ))}
                </ul>
              </Col>
            </Row>

            {/* Alertas */}
            {analisisIA.alertas && analisisIA.alertas.length > 0 && (
              <Alert variant="warning" className="mb-0">
                <h6 className="alert-heading">
                  <i className="fas fa-exclamation-triangle me-2"></i>Alertas
                </h6>
                <ul className="mb-0">
                  {analisisIA.alertas.map((alerta, idx) => (
                    <li key={idx}>{alerta}</li>
                  ))}
                </ul>
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Gráficos originales */}
      <Row className="g-3 mb-4">
        <Col lg={8}>
          {salesData && <SalesChart data={salesData} />}
        </Col>
        <Col lg={4}>
          {categoryData && <CategoryChart data={categoryData} />}
        </Col>
      </Row>

      {/* Productos destacados y categorías */}
      <Row className="g-3 mb-4">
        <Col lg={6}>
          <TopProducts stats={processedStats} />
        </Col>
        <Col lg={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-layer-group me-2"></i>
                Resumen por Categorías
              </h5>
            </Card.Header>
            <Card.Body>
              {processedStats && processedStats.ventas_por_categoria.map((categoria, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                  <div>
                    <h6 className="mb-0">{categoria.categoria}</h6>
                    <small className="text-muted">Categoría de productos</small>
                  </div>
                  <Badge bg="primary" className="fs-6">
                    {formatCurrency(categoria.ventas)}
                  </Badge>
                </div>
              ))}
              {processedStats && processedStats.ventas_por_categoria.length === 0 && (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-inbox fa-3x mb-3 d-block"></i>
                  No hay datos de categorías disponibles
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de predicciones */}
      <Row className="g-3">
        <Col xs={12}>
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