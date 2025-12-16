import { useState } from "react";
import { ReporteUseCase } from "../../../application/usecases/Reporte_uc";
import { ProductoUseCase } from "../../../application/usecases/Producto_uc";
import { APIGateway } from "../../../infraestructure/services/APIGateway";
import type { ReportParams } from "./ReporteBuilderForm";
import { generarPDFReporte } from "../../../services/pdfExporter";
import type { ReportStructure } from "../../../services/reporteOpenAIService";

const ReporteHook = () => {
  const [loading, setLoading] = useState(false);
  const reporte_uc = new ReporteUseCase(new APIGateway());
  const producto_uc = new ProductoUseCase(new APIGateway());

  const ejecutarReporte = async ({
    tabla,
    campos,
    fechaInicio,
    fechaFin,
  }: ReportParams) => {
    try {
      setLoading(true);

      const response = await reporte_uc.post_django({"model_name": tabla.value, "atributos":campos, "fecha_inicio":fechaInicio, "fecha_fin":fechaFin, "filtros": null });
      if (!response) throw Error("Error en la generación del reporte");

      return response;
    } catch (error) {
      throw Error(`Error en la generación del reporte: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const ejecutarReporteNatural = async (consulta: string, estructura?: ReportStructure) => {
    try {
      setLoading(true);
      
      console.log('Ejecutando reporte natural:', { consulta, estructura });
      
      // CASO ESPECIAL: Productos destacados
      if (
        consulta.toLowerCase().includes('productos destacados') || 
        consulta.toLowerCase().includes('producto destacado') ||
        estructura?.endpoint_sugerido === 'productos/destacados'
      ) {
        console.log('🌟 Detectado: Reporte de productos destacados');
        
        // Obtener todos los productos
        const todosProductos = await producto_uc.get();
        
        // Filtrar productos con stock > 0 (los destacados del dashboard)
        const productosDestacados = todosProductos.filter((p: any) => p.stock > 0);
        
        // Convertir a formato de reporte
        const reporteProductos = productosDestacados.map((p: any) => ({
          id: p.id,
          nombre: p.nombre,
          precio: `$${p.precio.toFixed(2)}`,
          stock: p.stock,
          marca: p.marca || 'N/A',
          categoria: p.categoria || 'N/A'
        }));
        
        console.log('✅ Productos destacados obtenidos:', reporteProductos.length);
        return reporteProductos;
      }
      
      // Si tenemos estructura de Gemini, podemos usar sus parámetros
      const parametros = estructura?.parametros || {};
      
      const response = await reporte_uc.post_reportenlp({
        consulta: consulta,
        ...parametros
      });
      
      console.log('Respuesta del backend:', response);
      
      if (!response) {
        throw new Error("El backend no devolvió datos. Verifica que esté corriendo en http://127.0.0.1:8000");
      }
      
      // Verificar si la respuesta tiene datos
      if (Array.isArray(response) && response.length === 0) {
        throw new Error("La consulta no devolvió resultados. Intenta con otros criterios.");
      }
      
      return response;
    } catch (error) {
      console.error('Error detallado en ejecutarReporteNatural:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      throw new Error(`Error en la generación del reporte: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Exporta datos a PDF usando el servicio de PDF
   */
  const exportarPDF = (
    datos: any[], 
    columnas: string[], 
    titulo: string, 
    descripcion?: string
  ) => {
    try {
      if (!datos || datos.length === 0) {
        throw new Error("No hay datos para exportar");
      }

      console.log('📄 Exportando PDF:', { titulo, columnas, cantidadDatos: datos.length });

      generarPDFReporte({
        titulo,
        descripcion,
        datos,
        columnas,
        nombreArchivo: `reporte_${titulo.toLowerCase().replace(/\s+/g, '_')}`,
        orientacion: columnas.length > 5 ? 'landscape' : 'portrait',
        incluirFecha: true,
        pieReporte: 'Generado por SmartSales365'
      });

      console.log('✅ PDF generado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error al exportar PDF:', error);
      throw new Error(`Error al exportar PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const descargarArchivo = async (data: Record<string, any>) => {
    try{
      setLoading(true);
      const response = await reporte_uc.post_file(data);
      if (!response) throw Error("Error en la generación del reporte");
    
      const url = window.URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reporte.${data.formato==="excel"? "xlsx": data.formato}`;
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    }catch(error){
      throw Error(`Error no se pudo descargar el reporte: ${error}`);
    }finally{
      setLoading(false);
    }
  };

  return {
    loading,
    ejecutarReporte,
    descargarArchivo,
    ejecutarReporteNatural,
    exportarPDF,
  };
};

export default ReporteHook;