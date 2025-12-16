import React, { useState } from "react";
import ReporteBuilderForm, { type ReportParams } from "./ReporteBuilderForm";
import ReporteTablaResultados from "./ReporteTablaResultados";
import ReporteHook from "./reportehook";
import Loading from "../../components/loading";
import { Tabs, Tab, Alert, Button } from 'react-bootstrap';
import ReporteLenguajeNatural from "./ReporteNLP";
import type { ReportStructure } from "../../../services/reporteOpenAIService";
import { toast } from "react-toastify";

const Reporte: React.FC = () => {
  const reportehook = ReporteHook();

  const [resultados, setResultados] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<string>('natural'); // Cambiar a "natural" por defecto
  const [tituloReporte, setTituloReporte] = useState<string>('Reporte');
  const [descripcionReporte, setDescripcionReporte] = useState<string>('');

  const [form, setForm] = useState<ReportParams>({
    tabla: { fields: [], value: "", label: "" },
    campos: [],
    fechaInicio: "",
    fechaFin: "",
  });

  const onGenerateReporte = async (params: any) => {
    const response = await reportehook.ejecutarReporte(params);
    setResultados(response);
  };

  const onGenerateReporteNatural = async (consulta: string, estructura?: ReportStructure) => {
    try {
      // Guardar información del reporte para el PDF
      if (estructura) {
        setTituloReporte(estructura.titulo);
        setDescripcionReporte(estructura.descripcion);
      } else {
        setTituloReporte('Reporte Personalizado');
        setDescripcionReporte(consulta);
      }

      // Procesar la consulta natural
      console.log('Iniciando generación de reporte con:', { consulta, estructura });
      const resultadoNLP = await reportehook.ejecutarReporteNatural(consulta, estructura);
      
      console.log('Resultado NLP recibido:', resultadoNLP);
      
      setResultados(resultadoNLP);
      
      toast.success('✅ Reporte generado exitosamente');
    } catch (error) {
      console.error('Error completo en onGenerateReporteNatural:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`❌ ${errorMsg}`);
      throw error;
    }
  };

  const onExportPDF = () => {
    try {
      if (!resultados || resultados.length === 0) {
        toast.warning('No hay datos para exportar');
        return;
      }

      // Obtener las columnas del primer objeto
      const columnas = Object.keys(resultados[0]);
      
      reportehook.exportarPDF(
        resultados,
        columnas,
        tituloReporte,
        descripcionReporte
      );

      toast.success('PDF descargado exitosamente');
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      toast.error('Error al exportar PDF');
    }
  };

  if (reportehook.loading) {
    return (
      <div className="container py-4">
        <h3 className="fw-bold mb-4">
          <Loading />
        </h3>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">
        <i className="bi bi-clipboard-data me-2"></i>
        Reportes Personalizados
      </h3>

      <Alert variant="info" className="mb-4">
        <div className="d-flex">
          <i className="bi bi-stars me-2 mt-1"></i>
          <div>
            <strong>🎉 Nueva función potenciada por IA:</strong> Ahora puedes generar reportes usando lenguaje natural o voz. 
            Solo describe lo que necesitas y OpenAI lo convertirá en un reporte profesional. ¡Descárgalo en PDF con un click!
          </div>
        </div>
      </Alert>

      <Tabs
        activeKey={activeTab}
        onSelect={(tab) => setActiveTab(tab || 'constructor')}
        className="mb-4"
        fill
      >
        <Tab eventKey="natural" title={
          <span>
            <i className="bi bi-chat-left-text me-1"></i>
            Lenguaje Natural
            <span className="badge bg-success ms-1">Nuevo</span>
          </span>
        }>
          <div className="row mt-3">
            <div className="col-12 col-lg-5 mb-4">
              <ReporteLenguajeNatural 
                onGenerate={onGenerateReporteNatural}
                loading={reportehook.loading}
              />
            </div>
            <div className="col-12 col-lg-7">
              {resultados.length > 0 && (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">
                      <i className="bi bi-table me-2"></i>
                      {tituloReporte}
                    </h5>
                    <div className="btn-group">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={onExportPDF}
                        title="Descargar PDF"
                      >
                        <i className="bi bi-file-pdf me-1"></i> PDF
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => reportehook.descargarArchivo({ "formato": "csv", "reporte": resultados })}
                        title="Descargar CSV"
                      >
                        <i className="bi bi-filetype-csv me-1"></i> CSV
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => reportehook.descargarArchivo({ "formato": "excel", "reporte": resultados })}
                        title="Descargar Excel"
                      >
                        <i className="bi bi-file-excel me-1"></i> Excel
                      </Button>
                    </div>
                  </div>
                  {descripcionReporte && (
                    <Alert variant="light" className="py-2 mb-3">
                      <small className="text-muted">{descripcionReporte}</small>
                    </Alert>
                  )}
                </>
              )}
              <ReporteTablaResultados data={resultados} />
            </div>
          </div>
        </Tab>

        <Tab eventKey="constructor" title={
          <span>
            <i className="bi bi-tools me-1"></i>
            Constructor Avanzado
          </span>
        }>
          <div className="row mt-3">
            <div className="col-12 col-lg-4 mb-4">
              <ReporteBuilderForm 
                onGenerate={onGenerateReporte} 
                loading={reportehook.loading} 
                form={form} 
                setForm={setForm} 
              />
            </div>
            <div className="col-12 col-lg-8">
              {resultados.length > 0 && (
                <div className="d-flex justify-content-end mb-3">
                  <div className="btn-group">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={onExportPDF}
                      title="Descargar PDF"
                    >
                      <i className="bi bi-file-pdf me-1"></i> PDF
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => reportehook.descargarArchivo({ "formato": "csv", "reporte": resultados })}
                      title="Descargar CSV"
                    >
                      <i className="bi bi-filetype-csv me-1"></i> CSV
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => reportehook.descargarArchivo({ "formato": "excel", "reporte": resultados })}
                      title="Descargar Excel"
                    >
                      <i className="bi bi-file-excel me-1"></i> Excel
                    </Button>
                  </div>
                </div>
              )}
              <ReporteTablaResultados data={resultados} />
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Reporte;