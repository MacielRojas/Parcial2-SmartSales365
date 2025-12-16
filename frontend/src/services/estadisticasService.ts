// estadisticasService.ts - Servicio para análisis de estadísticas con IA

export interface VentaSimulada {
  id: number;
  fecha: string;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  total: number;
  categoria: string;
}

export interface EstadisticaVentas {
  total_ventas_periodo: number;
  cantidad_transacciones: number;
  ticket_promedio: number;
  producto_mas_vendido: {
    nombre: string;
    cantidad: number;
    ingresos: number;
  };
  categoria_mas_vendida: {
    nombre: string;
    total: number;
  };
  tendencia: 'creciente' | 'estable' | 'decreciente';
  comparacion_periodo_anterior: number;
}

export interface AnalisisIA {
  resumen_ejecutivo: string;
  insights_principales: string[];
  recomendaciones: string[];
  predicciones: string[];
  alertas: string[];
  oportunidades: string[];
}

/**
 * Simula datos de ventas basados en productos destacados
 */
export const simularVentas = (productosDestacados: any[]): VentaSimulada[] => {
  const ventas: VentaSimulada[] = [];
  const hoy = new Date();
  
  // Generar ventas de los últimos 30 días
  for (let dia = 29; dia >= 0; dia--) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - dia);
    
    // Cada día tiene entre 5 y 15 ventas
    const ventasPorDia = Math.floor(Math.random() * 11) + 5;
    
    for (let i = 0; i < ventasPorDia; i++) {
      // Seleccionar un producto aleatorio (productos destacados tienen más probabilidad)
      const producto = productosDestacados[Math.floor(Math.random() * productosDestacados.length)];
      
      if (producto) {
        const cantidad = Math.floor(Math.random() * 5) + 1;
        const precioUnitario = producto.precio || 100;
        
        ventas.push({
          id: ventas.length + 1,
          fecha: fecha.toISOString().split('T')[0],
          producto_id: producto.id,
          producto_nombre: producto.nombre,
          cantidad,
          precio_unitario: precioUnitario,
          total: cantidad * precioUnitario,
          categoria: producto.categoria_nombre || 'General'
        });
      }
    }
  }
  
  return ventas;
};

/**
 * Calcula estadísticas a partir de ventas simuladas
 */
export const calcularEstadisticas = (ventas: VentaSimulada[]): EstadisticaVentas => {
  const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
  const cantidadTransacciones = ventas.length;
  const ticketPromedio = totalVentas / cantidadTransacciones;
  
  // Producto más vendido
  const ventasPorProducto = ventas.reduce((acc, v) => {
    const key = v.producto_nombre;
    if (!acc[key]) {
      acc[key] = { cantidad: 0, ingresos: 0 };
    }
    acc[key].cantidad += v.cantidad;
    acc[key].ingresos += v.total;
    return acc;
  }, {} as Record<string, { cantidad: number; ingresos: number }>);
  
  const productoMasVendido = Object.entries(ventasPorProducto)
    .sort((a, b) => b[1].cantidad - a[1].cantidad)[0];
  
  // Categoría más vendida
  const ventasPorCategoria = ventas.reduce((acc, v) => {
    if (!acc[v.categoria]) {
      acc[v.categoria] = 0;
    }
    acc[v.categoria] += v.total;
    return acc;
  }, {} as Record<string, number>);
  
  const categoriaMasVendida = Object.entries(ventasPorCategoria)
    .sort((a, b) => b[1] - a[1])[0];
  
  // Calcular tendencia (últimos 7 días vs 7 días anteriores)
  const hoy = new Date();
  const hace7Dias = new Date(hoy);
  hace7Dias.setDate(hace7Dias.getDate() - 7);
  const hace14Dias = new Date(hoy);
  hace14Dias.setDate(hace14Dias.getDate() - 14);
  
  const ventasUltimos7 = ventas.filter(v => new Date(v.fecha) >= hace7Dias);
  const ventas7Anteriores = ventas.filter(v => 
    new Date(v.fecha) < hace7Dias && new Date(v.fecha) >= hace14Dias
  );
  
  const totalUltimos7 = ventasUltimos7.reduce((sum, v) => sum + v.total, 0);
  const total7Anteriores = ventas7Anteriores.reduce((sum, v) => sum + v.total, 0);
  
  const comparacion = total7Anteriores > 0 
    ? ((totalUltimos7 - total7Anteriores) / total7Anteriores) * 100 
    : 0;
  
  let tendencia: 'creciente' | 'estable' | 'decreciente';
  if (comparacion > 5) tendencia = 'creciente';
  else if (comparacion < -5) tendencia = 'decreciente';
  else tendencia = 'estable';
  
  return {
    total_ventas_periodo: totalVentas,
    cantidad_transacciones: cantidadTransacciones,
    ticket_promedio: ticketPromedio,
    producto_mas_vendido: {
      nombre: productoMasVendido ? productoMasVendido[0] : 'N/A',
      cantidad: productoMasVendido ? productoMasVendido[1].cantidad : 0,
      ingresos: productoMasVendido ? productoMasVendido[1].ingresos : 0
    },
    categoria_mas_vendida: {
      nombre: categoriaMasVendida ? categoriaMasVendida[0] : 'N/A',
      total: categoriaMasVendida ? categoriaMasVendida[1] : 0
    },
    tendencia,
    comparacion_periodo_anterior: Math.round(comparacion * 100) / 100
  };
};

/**
 * Llama directamente a OpenAI Chat Completions
 */
async function fetchOpenAICompletion({ 
  prompt, 
  model, 
  temperature = 0.2,
  max_tokens = 1000 
}: { 
  prompt: string; 
  model: string;
  temperature?: number;
  max_tokens?: number;
}): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  const apiUrl = (import.meta.env.VITE_OPENAI_API_URL as string | undefined) || 
    "https://api.openai.com/v1/chat/completions";
  
  if (!apiKey) throw new Error("Falta VITE_OPENAI_API_KEY");

  const body = {
    model,
    temperature,
    max_tokens,
    messages: [{ role: "user", content: prompt }],
  };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${text}`);
  }
  
  const data = await res.json();
  return data.choices?.[0]?.message?.content || JSON.stringify(data);
}

/**
 * Obtiene análisis inteligente con OpenAI
 */
export const obtenerAnalisisIA = async (
  estadisticas: EstadisticaVentas,
  ventas: VentaSimulada[]
): Promise<AnalisisIA> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('API Key de OpenAI no configurada, retornando análisis por defecto');
    return generarAnalisisPorDefecto(estadisticas);
  }

  try {
    // Preparar datos para la IA
    const ventasPorDia = ventas.reduce((acc, v) => {
      if (!acc[v.fecha]) {
        acc[v.fecha] = 0;
      }
      acc[v.fecha] += v.total;
      return acc;
    }, {} as Record<string, number>);
    
    const prompt = `
Eres un analista de ventas experto. Analiza los siguientes datos de ventas y proporciona insights accionables:

ESTADÍSTICAS GENERALES:
- Total de ventas en el período: $${estadisticas.total_ventas_periodo.toFixed(2)}
- Número de transacciones: ${estadisticas.cantidad_transacciones}
- Ticket promedio: $${estadisticas.ticket_promedio.toFixed(2)}
- Producto más vendido: ${estadisticas.producto_mas_vendido.nombre} (${estadisticas.producto_mas_vendido.cantidad} unidades, $${estadisticas.producto_mas_vendido.ingresos})
- Categoría líder: ${estadisticas.categoria_mas_vendida.nombre} ($${estadisticas.categoria_mas_vendida.total})
- Tendencia: ${estadisticas.tendencia} (${estadisticas.comparacion_periodo_anterior > 0 ? '+' : ''}${estadisticas.comparacion_periodo_anterior}% vs período anterior)

VENTAS DIARIAS (últimos 10 días):
${Object.entries(ventasPorDia).slice(-10).map(([fecha, total]) => 
  `${fecha}: $${total.toFixed(2)}`
).join('\n')}

Por favor proporciona un análisis en formato JSON con esta estructura exacta:
{
  "resumen_ejecutivo": "Resumen breve y claro del desempeño (2-3 oraciones)",
  "insights_principales": [
    "Insight 1: Observación clave sobre el desempeño",
    "Insight 2: Patrón identificado en las ventas",
    "Insight 3: Análisis de productos/categorías"
  ],
  "recomendaciones": [
    "Recomendación 1: Acción específica para mejorar ventas",
    "Recomendación 2: Estrategia de marketing sugerida",
    "Recomendación 3: Optimización operativa"
  ],
  "predicciones": [
    "Predicción 1: Expectativa para próxima semana",
    "Predicción 2: Tendencia esperada del producto líder",
    "Predicción 3: Oportunidad de crecimiento identificada"
  ],
  "alertas": [
    "Alerta sobre stock, tendencias negativas, o riesgos (puede estar vacío si no hay alertas)"
  ],
  "oportunidades": [
    "Oportunidad 1: Producto o categoría con potencial",
    "Oportunidad 2: Momento ideal para promociones",
    "Oportunidad 3: Estrategia de cross-selling"
  ]
}

IMPORTANTE: Responde ÚNICAMENTE con el JSON, sin texto adicional antes o después.
`;

    const response = await fetchOpenAICompletion({
      prompt,
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 1000
    });

    // Parsear respuesta JSON
    const cleanedResponse = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const analisis = JSON.parse(cleanedResponse);
    
    return {
      resumen_ejecutivo: analisis.resumen_ejecutivo || 'Análisis generado con éxito',
      insights_principales: analisis.insights_principales || [],
      recomendaciones: analisis.recomendaciones || [],
      predicciones: analisis.predicciones || [],
      alertas: analisis.alertas || [],
      oportunidades: analisis.oportunidades || []
    };
    
  } catch (error) {
    console.error('Error al obtener análisis de IA:', error);
    return generarAnalisisPorDefecto(estadisticas);
  }
};

/**
 * Genera análisis por defecto si la IA no está disponible
 */
const generarAnalisisPorDefecto = (estadisticas: EstadisticaVentas): AnalisisIA => {
  const insights: string[] = [
    `Las ventas totales alcanzaron $${estadisticas.total_ventas_periodo.toFixed(2)} en el período analizado`,
    `El ticket promedio es de $${estadisticas.ticket_promedio.toFixed(2)} por transacción`,
    `${estadisticas.producto_mas_vendido.nombre} lidera las ventas con ${estadisticas.producto_mas_vendido.cantidad} unidades`
  ];
  
  const recomendaciones: string[] = [
    'Mantener stock adecuado de los productos más vendidos',
    'Considerar promociones en productos de bajo rendimiento',
    'Analizar estrategias de la competencia'
  ];
  
  const predicciones: string[] = [
    estadisticas.tendencia === 'creciente' 
      ? 'Se espera un crecimiento sostenido en las próximas semanas'
      : estadisticas.tendencia === 'decreciente'
      ? 'Se recomienda implementar estrategias para revertir la tendencia'
      : 'Las ventas se mantendrán estables en el corto plazo'
  ];
  
  const alertas: string[] = [];
  if (estadisticas.tendencia === 'decreciente') {
    alertas.push('⚠️ Tendencia decreciente detectada - requiere atención inmediata');
  }
  
  const oportunidades: string[] = [
    `La categoría ${estadisticas.categoria_mas_vendida.nombre} muestra gran potencial`,
    'Considerar estrategias de bundle con productos complementarios',
    'Explorar nuevos canales de venta para aumentar el alcance'
  ];
  
  return {
    resumen_ejecutivo: `El negocio procesó ${estadisticas.cantidad_transacciones} transacciones generando $${estadisticas.total_ventas_periodo.toFixed(2)}. La tendencia es ${estadisticas.tendencia} con una variación de ${estadisticas.comparacion_periodo_anterior}% respecto al período anterior.`,
    insights_principales: insights,
    recomendaciones,
    predicciones,
    alertas,
    oportunidades
  };
};

/**
 * Exporta datos de estadísticas a formato para gráficos
 */
export const prepararDatosGraficos = (ventas: VentaSimulada[]) => {
  // Ventas por día (últimos 14 días)
  const ventasPorDia = ventas.reduce((acc, v) => {
    if (!acc[v.fecha]) {
      acc[v.fecha] = 0;
    }
    acc[v.fecha] += v.total;
    return acc;
  }, {} as Record<string, number>);
  
  const fechasOrdenadas = Object.keys(ventasPorDia).sort().slice(-14);
  
  const datosVentasDiarias = {
    labels: fechasOrdenadas.map(f => {
      const fecha = new Date(f);
      return `${fecha.getDate()}/${fecha.getMonth() + 1}`;
    }),
    datasets: [{
      label: 'Ventas Diarias',
      data: fechasOrdenadas.map(f => ventasPorDia[f]),
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };
  
  // Top 5 productos por ventas
  const ventasPorProducto = ventas.reduce((acc, v) => {
    if (!acc[v.producto_nombre]) {
      acc[v.producto_nombre] = 0;
    }
    acc[v.producto_nombre] += v.total;
    return acc;
  }, {} as Record<string, number>);
  
  const top5Productos = Object.entries(ventasPorProducto)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const datosTopProductos = {
    labels: top5Productos.map(p => p[0]),
    datasets: [{
      label: 'Ingresos por Producto',
      data: top5Productos.map(p => p[1]),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ]
    }]
  };
  
  // Ventas por categoría
  const ventasPorCategoria = ventas.reduce((acc, v) => {
    if (!acc[v.categoria]) {
      acc[v.categoria] = 0;
    }
    acc[v.categoria] += v.total;
    return acc;
  }, {} as Record<string, number>);
  
  const datosCategorias = {
    labels: Object.keys(ventasPorCategoria),
    datasets: [{
      data: Object.values(ventasPorCategoria),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
      ]
    }]
  };
  
  return {
    ventasDiarias: datosVentasDiarias,
    topProductos: datosTopProductos,
    categorias: datosCategorias
  };
};
