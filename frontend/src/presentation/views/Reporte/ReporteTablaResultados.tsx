import React from "react";

interface Props {
  data: Record<string, any>[];
}

const ReporteTablaResultados: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0)
    return (
      <div className="text-center text-muted mt-5">
        <i className="bi bi-database fs-2 mb-2 d-block"></i>
        No hay resultados para mostrar
      </div>
    );

  const columnas = Object.keys(data[0]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              {columnas.map((col) => (
                <th key={col} className="text-capitalize">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {columnas.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReporteTablaResultados;
