import React from "react";
import { SelectField } from "../../components/fields";
import { User } from "../../../domain/entities/Usuario";
import { ProductoEntity } from "../../../domain/entities/Producto_entity";
import { VentaEntity } from "../../../domain/entities/Venta_entity";
import { CategoriaEntity } from "../../../domain/entities/Categoria_entity";
import { FacturaEntity } from "../../../domain/entities/Factura_entity";

export interface ReportParams {
  tabla: {fields: string[], value: string, label: string};
  campos: string[];
  fechaInicio?: string;
  fechaFin?: string;
}

interface Props {
  onGenerate: (params: ReportParams) => void;
  loading: boolean;
  form: ReportParams;
  setForm: (form: ReportParams) => void;
}

const ReporteBuilderForm: React.FC<Props> = ({ onGenerate, loading, form, setForm }) => {
  const tablas = [
      {fields:Object.keys(new User(null,'','','','','','',[],false)), value:'User', label:'Usuarios'},
      {fields:Object.keys(new ProductoEntity(null,'',0,0,'','',0)), value:'Producto',label:'Productos'},
      {fields:Object.keys(new VentaEntity(null,0,0)), value:'Venta',label:'Ventas'},
      {fields:Object.keys(new CategoriaEntity(null,'',null)), value:'Categoria',label:'Categorias'},
      {fields:Object.keys(new FacturaEntity(null,0,null,null)), value:'Factura',label:'Facturas'}
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    let tabla = tablas.find(t => t.value === e.target.value);
    if (!tabla) return;
    setForm({ ...form, campos: [], [e.target.name]: tabla });
  };

  const handleCampoToggle = (campo: string) => {
    const nuevosCampos = form.campos.includes(campo)
      ? form.campos.filter((c) => c !== campo)
      : [...form.campos, campo];
    setForm({ ...form, campos: nuevosCampos });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tabla || form.tabla.fields.length === 0)
      return alert("Selecciona una tabla y al menos un campo");
    onGenerate(form);
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h5 className="mb-3">Configurar Reporte</h5>

        <form onSubmit={handleSubmit}>
          {/* Tabla */}
          <div className="mb-3">
            <SelectField label="Tabla" name="tabla" options={tablas} value={form.tabla.value} onChange={handleChange}/>
          </div>

          {/* Campos */}
          {form.tabla && (
            <div className="mb-3">
              <label className="form-label">Campos</label>
              <div className="d-flex flex-wrap gap-2">
                {form.tabla.fields.map((campo) => (
                  <div key={campo} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={campo}
                      checked={form.campos.includes(campo)}
                      onChange={() => handleCampoToggle(campo)}
                    />
                    <label className="form-check-label" htmlFor={campo}>
                      {campo}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fechas */}
          <div className="mb-3">
            <label className="form-label">Rango de fechas (opcional)</label>
            <div className="d-flex gap-2">
              <input
                type="date"
                className="form-control"
                name="fechaInicio"
                value={form.fechaInicio}
                onChange={handleChange}
              />
              <input
                type="date"
                className="form-control"
                name="fechaFin"
                value={form.fechaFin}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Generando...
              </span>
            ) : (
              "Generar Reporte"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReporteBuilderForm;
