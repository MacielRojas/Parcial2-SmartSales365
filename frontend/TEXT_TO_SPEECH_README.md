# 🔊 Text-to-Speech para Análisis de Ventas

## Descripción

Funcionalidad de síntesis de voz integrada que permite escuchar el resumen ejecutivo del análisis de ventas mientras conduces o caminas. Utiliza la Web Speech API nativa del navegador, sin necesidad de APIs externas adicionales.

## Características

### 🎯 Funcionalidades Principales

1. **Lectura Automática en Español**
   - Detecta automáticamente voces en español del sistema
   - Configuración optimizada para claridad (velocidad 0.9, tono normal)
   - Narración fluida y profesional

2. **Controles de Reproducción**
   - ▶️ **Escuchar Análisis**: Inicia la lectura del resumen completo
   - ⏸️ **Pausar**: Detiene temporalmente la reproducción
   - ▶️ **Reanudar**: Continúa desde donde se pausó
   - ⏹️ **Detener**: Cancela completamente la lectura

3. **Indicadores Visuales**
   - Alerta informativa durante la reproducción
   - Spinner animado indicando estado activo
   - Botones contextuales según el estado (reproduciendo/pausado/detenido)

## Contenido Narrado

El sistema lee de forma narrativa:

1. **Resumen Ejecutivo**: Visión general del análisis
2. **Estadísticas Clave**: 
   - Total de ventas del período
   - Cantidad de transacciones
   - Ticket promedio
   - Tendencia (crecimiento/decrecimiento/estabilidad)
3. **Insights Principales**: Observaciones importantes
4. **Recomendaciones**: Acciones sugeridas
5. **Predicciones**: Proyecciones futuras
6. **Alertas**: Puntos de atención críticos
7. **Oportunidades**: Áreas de crecimiento potencial

## Uso

### Requisitos Previos

1. Tener un análisis de IA generado (botón "Generar Análisis con IA")
2. Navegador compatible con Web Speech API (Chrome, Edge, Safari, Firefox)
3. Permisos de audio habilitados en el navegador

### Pasos para Usar

1. **Generar Análisis**
   ```
   Click en "Generar Análisis con IA" → Esperar resultado
   ```

2. **Iniciar Lectura**
   ```
   Click en botón verde "🔊 Escuchar Análisis"
   ```

3. **Controlar Reproducción**
   - Pausar: Click en botón amarillo "⏸️ Pausar"
   - Reanudar: Click en botón amarillo "▶️ Reanudar"
   - Detener: Click en botón rojo "⏹️ Detener"

## Compatibilidad de Navegadores

| Navegador | Compatible | Voces en Español |
|-----------|-----------|------------------|
| Chrome/Chromium | ✅ Excelente | ✅ Google Español |
| Microsoft Edge | ✅ Excelente | ✅ Microsoft Helena/Pablo |
| Safari (macOS/iOS) | ✅ Muy Bueno | ✅ Voces Siri Español |
| Firefox | ⚠️ Limitado | ⚠️ Depende del SO |
| Opera | ✅ Bueno | ✅ Basado en Chromium |

## Configuración de Voces

### Windows
```
Configuración → Hora e idioma → Voz
- Agregar voces en español (Helena Online, Pablo)
```

### macOS
```
Preferencias del Sistema → Accesibilidad → Contenido leído
- Descargar voces Siri en español (México/España)
```

### Linux
```bash
# Instalar espeak
sudo apt-get install espeak espeak-data
```

## Código Técnico

### Estados React
```typescript
const [leyendo, setLeyendo] = useState(false);      // Indica si está reproduciendo
const [pausado, setPausado] = useState(false);      // Indica si está en pausa
const [vozDisponible, setVozDisponible] = useState(false); // API disponible
```

### Función Principal: `leerAnalisis()`
```typescript
const leerAnalisis = () => {
  const texto = generarTextoNarrativo();
  const utterance = new SpeechSynthesisUtterance(texto);
  
  // Configurar voz en español
  const voices = window.speechSynthesis.getVoces();
  const vozEspanol = voices.find(voice => 
    voice.lang.startsWith('es-') || voice.lang === 'es'
  );
  
  utterance.voice = vozEspanol;
  utterance.lang = 'es-ES';
  utterance.rate = 0.9;  // Velocidad
  utterance.pitch = 1.0; // Tono
  utterance.volume = 1.0; // Volumen
  
  window.speechSynthesis.speak(utterance);
};
```

### Función de Conversión: `generarTextoNarrativo()`
Convierte el objeto JSON del análisis en un texto narrativo fluido:
```typescript
const generarTextoNarrativo = (): string => {
  let texto = 'Resumen ejecutivo de análisis de ventas. ';
  
  // Agregar cada sección del análisis
  texto += analisisIA.resumen_ejecutivo;
  texto += estadisticasVentas.total_ventas_periodo;
  // ... más contenido
  
  return texto;
};
```

## Solución de Problemas

### ❌ "La funcionalidad de voz no está disponible"
**Causa**: Navegador no soporta Web Speech API
**Solución**: Usar Chrome, Edge o Safari actualizados

### ❌ No se escucha en español
**Causa**: No hay voces en español instaladas
**Solución**: 
1. Windows: Agregar paquete de idioma español
2. macOS: Descargar voces Siri en español
3. Linux: Instalar espeak-data con soporte español

### ❌ La voz se detiene abruptamente
**Causa**: Navegación fuera de la página
**Solución**: El componente cancela automáticamente la lectura al desmontarse

### ❌ Voces robóticas o de mala calidad
**Causa**: Voces del sistema limitadas
**Solución**: 
- Chrome/Edge: Usar voces "Online" (requiere internet)
- macOS: Descargar voces premium de Siri

## Mejoras Futuras (Roadmap)

- [ ] Selector de voz (permitir elegir entre voces disponibles)
- [ ] Control de velocidad ajustable (0.5x - 2x)
- [ ] Barra de progreso de lectura
- [ ] Exportar audio a archivo MP3/WAV
- [ ] Resúmenes personalizados (corto/medio/completo)
- [ ] Soporte multiidioma (inglés, portugués)
- [ ] Integración con servicios cloud (Google TTS, Amazon Polly)

## Casos de Uso

### 📱 Móvil
- Escuchar mientras conduces al trabajo
- Revisar análisis durante el ejercicio
- Multitarea en tareas domésticas

### 💼 Oficina
- Revisión de reportes mientras trabajas en otras tareas
- Accesibilidad para usuarios con discapacidad visual
- Aprendizaje auditivo de métricas clave

### 🏠 Remoto
- Revisión de ventas durante pausas activas
- Actualización de métricas sin interrumpir flujo de trabajo

## Notas de Desarrollo

### Limpieza de Recursos
```typescript
useEffect(() => {
  return () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };
}, []);
```
El hook limpia automáticamente cualquier lectura activa cuando el componente se desmonta.

### Detección de Voces
```typescript
window.speechSynthesis.onvoiceschanged = cargarVoces;
```
Algunas voces se cargan de forma asíncrona, especialmente en Chrome.

## Referencias

- [MDN Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [SpeechSynthesis Interface](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- [SpeechSynthesisUtterance](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance)

---

**Última actualización**: Diciembre 2025
**Versión**: 1.0.0
**Autor**: SmartSales365 Team
