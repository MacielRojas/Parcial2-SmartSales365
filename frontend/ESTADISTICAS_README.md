# 📊 Dashboard de Estadísticas Inteligente

## Descripción General

El Dashboard de Estadísticas es un módulo completo que combina **análisis de datos en tiempo real** con **inteligencia artificial** para proporcionar insights accionables sobre el desempeño de ventas.

## 🎯 Características Principales

### 1. **Productos Destacados**
- Carga automática de productos con stock disponible
- Simulación realista de datos de ventas (últimos 30 días)
- Análisis basado en productos reales del sistema

### 2. **Métricas Clave**
- **Total de Ventas**: Ingresos totales del período
- **Transacciones**: Número de operaciones realizadas
- **Ticket Promedio**: Valor promedio por transacción
- **Producto Líder**: Producto más vendido con estadísticas
- **Categoría Top**: Categoría con mayores ingresos

### 3. **Análisis con IA (OpenAI)**
El sistema utiliza OpenAI GPT-4 para generar análisis inteligentes que incluyen:

#### 📝 Resumen Ejecutivo
- Síntesis clara del desempeño general
- Métricas principales destacadas
- Contexto del período analizado

#### 💡 Insights Principales
- Observaciones clave sobre patrones de venta
- Identificación de tendencias
- Análisis de productos y categorías

#### 🎯 Recomendaciones
- Acciones específicas para mejorar ventas
- Estrategias de marketing sugeridas
- Optimizaciones operativas

#### 🔮 Predicciones
- Expectativas para próximos períodos
- Tendencias esperadas de productos líderes
- Oportunidades de crecimiento identificadas

#### ⚠️ Alertas
- Productos con bajo stock
- Tendencias negativas que requieren atención
- Riesgos potenciales

#### 🚀 Oportunidades
- Productos/categorías con potencial no explotado
- Momentos ideales para promociones
- Estrategias de cross-selling

### 4. **Visualizaciones**
- **Gráficos de Ventas**: Tendencias temporales
- **Gráficos por Categoría**: Distribución de ingresos
- **Top Productos**: Ranking de productos más vendidos
- **Resumen por Categorías**: Desglose detallado

### 5. **Tendencias Automáticas**
El sistema calcula automáticamente:
- Comparación con período anterior (últimos 7 vs 7 días previos)
- Clasificación de tendencia: Creciente ⬆️ / Estable ➡️ / Decreciente ⬇️
- Porcentaje de cambio

## 🚀 Cómo Usar

### Prerequisitos
1. **Backend Django** corriendo en `http://127.0.0.1:8000`
2. **OpenAI API Key** configurada en `.env`:
   ```env
   ```

### Pasos para Iniciar

#### 1. Configurar API Key
```bash
# Edita el archivo .env en la carpeta frontend
VITE_OPENAI_API_KEY=tu_api_key_real
```

#### 2. Iniciar Backend (Django)
```bash
cd backend
python manage.py runserver
```

#### 3. Iniciar Frontend (React + Vite)
```bash
cd frontend
npm run dev
```

#### 4. Acceder al Dashboard
- Abre tu navegador en: `http://localhost:5173`
- Navega a: **Estadísticas** en el menú lateral

## 📈 Flujo de Funcionamiento

```
┌─────────────────────────────────────────────────────────┐
│  1. CARGA DE PRODUCTOS DESTACADOS                       │
│     - GET /especiales/productos/                        │
│     - Filtra productos con stock > 0                    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  2. SIMULACIÓN DE VENTAS                                │
│     - Genera 30 días de datos históricos               │
│     - 5-15 transacciones por día                       │
│     - Basado en productos reales                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  3. CÁLCULO DE ESTADÍSTICAS                            │
│     - Total de ventas                                   │
│     - Métricas de productos                            │
│     - Análisis de tendencias                           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  4. ANÁLISIS CON IA (OpenAI)                           │
│     - Envía datos a GPT-4o-mini                        │
│     - Genera insights y recomendaciones                │
│     - Proporciona predicciones                         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  5. RENDERIZADO EN INTERFAZ                            │
│     - Tarjetas de métricas animadas                    │
│     - Análisis IA con secciones organizadas            │
│     - Gráficos interactivos                            │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Interfaz de Usuario

### Componentes Visuales

#### Header
```
┌─────────────────────────────────────────────────────────┐
│ 📊 Dashboard de Ventas Inteligente    [🔄 Actualizar]  │
│ Estadísticas en tiempo real con análisis de IA         │
└─────────────────────────────────────────────────────────┘
```

#### Tarjetas de Métricas
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 💵 Total     │ 🧾 Trans-    │ 🏆 Producto  │ 🏷️ Categoría │
│    Ventas    │    acciones  │    Líder     │    Top       │
│ $15,234.50   │    325       │  Producto A  │  Electrónicos│
│ ⬆️ +12.5%    │ Ticket: $47  │  45 unidades │  $8,500.00   │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

#### Análisis de IA
```
┌─────────────────────────────────────────────────────────┐
│ 🧠 Análisis Inteligente con IA                         │
├─────────────────────────────────────────────────────────┤
│ 📝 Resumen Ejecutivo                                    │
│    El negocio procesó 325 transacciones...             │
│                                                         │
│ 💡 Insights Principales          🎯 Recomendaciones    │
│ ✓ Las ventas aumentaron 12%      → Mantener stock     │
│ ✓ Producto A lidera con...       → Promocionar...     │
│                                                         │
│ 🔮 Predicciones                  🚀 Oportunidades      │
│ 📈 Crecimiento sostenido         🚀 Bundle productos   │
│ 📈 Demanda aumentará en...       🚀 Cross-selling      │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **React Bootstrap** para UI
- **Chart.js** para gráficos
- **Vite** como build tool

### Servicios
- **OpenAI GPT-4o-mini**: Análisis inteligente
- **Django REST API**: Backend de datos

### Características Técnicas
- **Simulación de datos realista** con distribución estadística
- **Análisis de tendencias** con comparación temporal
- **Cálculo automático** de métricas clave
- **Integración con IA** para insights predictivos

## 📦 Archivos Principales

```
frontend/
├── src/
│   ├── services/
│   │   └── estadisticasService.ts      # Lógica de negocio y IA
│   ├── presentation/
│   │   └── views/
│   │       └── Stadistic/
│   │           ├── Stadistic.tsx        # Componente principal
│   │           ├── StadisticHook.ts     # Hook de datos
│   │           ├── ProductosPopulares.tsx
│   │           └── PrediccionesProducto.tsx
│   └── App.css                          # Estilos (incluye estilos de estadísticas)
└── .env                                 # Variables de entorno
```

## 🔧 Configuración del Servicio

### `estadisticasService.ts`

```typescript
// Funciones principales:
simularVentas(productos)          // Genera datos de ventas
calcularEstadisticas(ventas)      // Calcula métricas
obtenerAnalisisIA(stats, ventas)  // Análisis con OpenAI
prepararDatosGraficos(ventas)     // Formatea para gráficos
```

## 🎨 Estilos CSS

Estilos personalizados en `App.css`:
- Animaciones de entrada (`slideInUp`, `fadeInLeft`)
- Efectos hover en tarjetas
- Gradientes para headers
- Badges con tendencias
- Responsive design

## 🐛 Solución de Problemas

### Error: "API Key de OpenAI no configurada"
```bash
# Solución:
1. Verifica que .env tenga VITE_OPENAI_API_KEY
2. Reinicia el servidor: Ctrl+C luego npm run dev
3. Recarga el navegador (F5)
```

### Error: "Error al cargar datos del dashboard"
```bash
# Solución:
1. Verifica que Django esté corriendo: http://127.0.0.1:8000
2. Verifica endpoint /especiales/productos/
3. Revisa console del navegador para detalles
```

### Los gráficos no aparecen
```bash
# Solución:
1. Verifica que haya datos en stats
2. Abre console del navegador (F12)
3. Busca errores relacionados con Chart.js
```

### El análisis IA no se genera
```bash
# Posibles causas:
1. API Key incorrecta o expirada
2. Sin créditos en cuenta de OpenAI
3. Límite de rate limit alcanzado
4. Error de red/conectividad

# El sistema mostrará análisis por defecto si la IA falla
```

## 📊 Datos Simulados

### Distribución de Ventas
- **Por día**: 5-15 transacciones aleatorias
- **Por producto**: Basado en productos reales con stock
- **Cantidad por venta**: 1-5 unidades
- **Período**: Últimos 30 días

### Cálculo de Tendencias
- **Últimos 7 días** vs **7 días anteriores**
- **Creciente**: > +5%
- **Estable**: -5% a +5%
- **Decreciente**: < -5%

## 🚀 Próximas Mejoras

- [ ] Exportar análisis a PDF
- [ ] Filtros por fecha personalizada
- [ ] Comparación con períodos anteriores
- [ ] Alertas automáticas por email
- [ ] Integración con datos reales de ventas
- [ ] Dashboard personalizable por usuario
- [ ] Más tipos de gráficos (radar, heatmap)

## 📝 Notas Importantes

1. **Datos Simulados**: Actualmente usa datos simulados basados en productos reales
2. **API Key Segura**: Nunca compartas tu VITE_OPENAI_API_KEY
3. **Costos OpenAI**: Cada análisis consume tokens (muy económico con gpt-4o-mini)
4. **Actualización**: Haz clic en "Actualizar" para regenerar el análisis

## 🎓 Para Desarrolladores

### Extender el Análisis IA

Para agregar nuevas secciones al análisis:

```typescript
// En estadisticasService.ts

const prompt = `
...
{
  "nueva_seccion": [
    "Item 1",
    "Item 2"
  ]
}
`;

// Luego agregar en la interfaz AnalisisIA:
export interface AnalisisIA {
  // ... campos existentes
  nueva_seccion: string[];
}
```

### Integrar Datos Reales

Reemplaza `simularVentas()` con:

```typescript
const fetchVentasReales = async () => {
  const response = await fetch(`${apiUrl}/ventas/?fecha_desde=...`);
  return await response.json();
};
```

## 📞 Soporte

Si encuentras problemas:
1. Revisa la console del navegador (F12)
2. Verifica que los servicios estén corriendo
3. Consulta este README
4. Revisa los logs del servidor backend

---

**Desarrollado con ❤️ para SmartSales365**

*Última actualización: Diciembre 2024*
