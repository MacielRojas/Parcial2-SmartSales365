import { useState } from "react";
import { ReporteUseCase } from "../../../application/usecases/Reporte_uc";
import { APIGateway } from "../../../infraestructure/services/APIGateway";
import type { ReportParams } from "./ReporteBuilderForm";

const ReporteHook = () => {
  const [loading, setLoading] = useState(false);
  const reporte_uc = new ReporteUseCase(new APIGateway());

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

  const ejecutarReporteNatural = async (consulta: string) => {
    try {
      setLoading(true);
      const response = await reporte_uc.post_reportenlp({"consulta":consulta});
      console.log(response);
      if (!response) throw Error("Error en la generación del reporte");
      return response;
    } catch (error) {
      throw Error(`Error en la generación del reporte: ${error}`);
    } finally {
      setLoading(false);
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
  };
};

export default ReporteHook;