import React, { useState } from "react";
import ReporteBuilderForm, { type ReportParams } from "./ReporteBuilderForm";
import ReporteTablaResultados from "./ReporteTablaResultados";
import ReporteHook from "./reportehook";
import Loading from "../../components/loading";
import { Tabs, Tab, Alert } from 'react-bootstrap';
import ReporteLenguajeNatural from "./ReporteNLP";

const Reporte: React.FC = () => {
  const reportehook = ReporteHook();

  const [resultados, setResultados] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<string>('constructor');

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

  const onGenerateReporteNatural = async (consulta: string) => {
    try {
      // Procesar la consulta natural
      const resultadoNLP = await reportehook.ejecutarReporteNatural(consulta);
      setResultados(resultadoNLP);
      
    } catch (error) {
      console.error('Error procesando consulta natural:', error);
      throw error;
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
          <i className="bi bi-info-circle me-2 mt-1"></i>
          <div>
            <strong>Nueva función:</strong> Ahora puedes generar reportes usando lenguaje natural. 
            Solo describe lo que necesitas y nuestro sistema lo creará automáticamente.
          </div>
        </div>
      </Alert>

      <Tabs
        activeKey={activeTab}
        onSelect={(tab) => setActiveTab(tab || 'constructor')}
        className="mb-4"
        fill
      >
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
                <div className="btn-group mb-3">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => reportehook.descargarArchivo({ "formato": "csv", "reporte": resultados })}
                  >
                    <i className="bi bi-filetype-csv me-1"></i> CSV
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => reportehook.descargarArchivo({ "formato": "excel", "reporte": resultados })}
                  >
                    <i className="bi bi-file-earmark-excel me-1"></i> Excel
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => reportehook.descargarArchivo({ "formato": "pdf", "reporte": resultados })}
                  >
                    <i className="bi bi-filetype-pdf me-1"></i> PDF
                  </button>
                </div>
              )}
              <ReporteTablaResultados data={resultados} />
            </div>
          </div>
        </Tab>

        <Tab eventKey="natural" title={
          <span>
            <i className="bi bi-chat-left-text me-1"></i>
            Lenguaje Natural
            <span className="badge bg-success ms-1">Nuevo</span>
          </span>
        }>
          <div className="row mt-3">
            <div className="col-12 col-lg-4 mb-4">
              <ReporteLenguajeNatural 
                onGenerate={onGenerateReporteNatural}
                loading={reportehook.loading}
              />
            </div>
            <div className="col-12 col-lg-8">
              {resultados.length > 0 && (
                <div className="btn-group mb-3">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => reportehook.descargarArchivo({ "formato": "csv", "reporte": resultados })}
                  >
                    <i className="bi bi-filetype-csv me-1"></i> CSV
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => reportehook.descargarArchivo({ "formato": "excel", "reporte": resultados })}
                  >
                    <i className="bi bi-file-earmark-excel me-1"></i> Excel
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => reportehook.descargarArchivo({ "formato": "pdf", "reporte": resultados })}
                  >
                    <i className="bi bi-filetype-pdf me-1"></i> PDF
                  </button>
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