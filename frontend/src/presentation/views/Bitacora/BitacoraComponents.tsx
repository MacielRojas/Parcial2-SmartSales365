import React from 'react';
import type { BitacoraEntity } from '../../../domain/entities/Bitacora_entity';
import { Badge } from 'react-bootstrap';

// Función auxiliar para las clases de los badges
const getTipoBadgeClass = (tipo: string): string => {
  switch (tipo) {
    case 'INFO':
      return 'bg-info';
    case 'WARNING':
      return 'bg-warning text-dark';
    case 'ERROR':
      return 'bg-danger';
    case 'SUCCESS':
      return 'bg-success';
    default:
      return 'bg-secondary';
  }
};

const getNivelIcon = (nivel: string): string => {
  switch (nivel) {
    case 'INFO':
      return 'ℹ️';
    case 'SUCCESS':
      return '✅';
    case 'WARNING':
      return '⚠️';
    case 'ERROR':
      return '❌';
    default:
      return '📝';
  }
};

interface BitacoraTableProps {
  entries: BitacoraEntity[];
  isLoading: boolean;
}

export const BitacoraTable2: React.FC<BitacoraTableProps> = ({
  entries,
  isLoading
}) => {
  // Debug: mostrar en consola los datos recibidos
  React.useEffect(() => {
    console.log('📋 BitacoraTable - Entries recibidas:', entries);
    console.log('📋 BitacoraTable - Cantidad:', entries.length);
    console.log('📋 BitacoraTable - Loading:', isLoading);
  }, [entries, isLoading]);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-2">Cargando registros...</p>
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
        <p className="text-muted">No hay registros en la bitácora</p>
        <small className="text-muted">Total de entradas: {entries?.length || 0}</small>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col">
              <i className="fas fa-clock me-2"></i>Fecha-Hora
            </th>
            <th scope="col">
              <i className="fas fa-network-wired me-2"></i>IP
            </th>
            <th scope="col">
              <i className="fas fa-user me-2"></i>Usuario
            </th>
            <th scope="col">
              <i className="fas fa-bolt me-2"></i>Acción
            </th>
            <th scope="col" className="text-center">
              <i className="fas fa-tag me-2"></i>Tipo
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>
                <small>
                  {entry.created_at ? (
                    <>
                      {new Date(entry.created_at).toLocaleDateString('es-ES')}
                      <br />
                      <span className="text-muted">
                        {new Date(entry.created_at).toLocaleTimeString('es-ES')}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </small>
              </td>
              <td>
                <code className="text-primary">{entry.ipv4}</code>
              </td>
              <td>
                <Badge bg="secondary">Usuario #{entry.usuario}</Badge>
              </td>
              <td>
                <div className="text-truncate" style={{ maxWidth: '300px' }} title={entry.accion}>
                  {entry.accion}
                </div>
              </td>
              <td className="text-center">
                <span className={`badge ${getTipoBadgeClass(entry.nivel)}`}>
                  {getNivelIcon(entry.nivel)} {entry.nivel}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// export const BitacoraForm2: React.FC<BitacoraFormProps> = ({
//   entry,
//   onSubmit,
//   onCancel,
//   isEditing,
//   isLoading
// }) => {
//   const [formData, setFormData] = React.useState<Partial<BitacoraEntry>>(entry);

//   React.useEffect(() => {
//     setFormData(entry);
//   }, [entry]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <div className="card">
//       <div className="card-header">
//         <h5 className="card-title mb-0">
//           {isEditing ? 'Editar Entrada' : 'Nueva Entrada'}
//         </h5>
//       </div>
//       <div className="card-body">
//         <form onSubmit={handleSubmit}>
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label htmlFor="titulo" className="form-label">
//                 Título <span className="text-danger">*</span>
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="titulo"
//                 name="titulo"
//                 value={formData.titulo || ''}
//                 onChange={handleChange}
//                 required
//                 maxLength={100}
//               />
//             </div>
//             <div className="col-md-6 mb-3">
//               <label htmlFor="tipo" className="form-label">
//                 Tipo <span className="text-danger">*</span>
//               </label>
//               <select
//                 className="form-select"
//                 id="tipo"
//                 name="tipo"
//                 value={formData.tipo || ''}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Seleccionar tipo...</option>
//                 <option value="INFO">Información</option>
//                 <option value="WARNING">Advertencia</option>
//                 <option value="ERROR">Error</option>
//                 <option value="SUCCESS">Éxito</option>
//               </select>
//             </div>
//           </div>
          
//           <div className="mb-3">
//             <label htmlFor="descripcion" className="form-label">
//               Descripción <span className="text-danger">*</span>
//             </label>
//             <textarea
//               className="form-control"
//               id="descripcion"
//               name="descripcion"
//               rows={4}
//               value={formData.descripcion || ''}
//               onChange={handleChange}
//               required
//               maxLength={500}
//             />
//             <div className="form-text">
//               {formData.descripcion?.length || 0}/500 caracteres
//             </div>
//           </div>

//           <div className="d-flex gap-2 justify-content-end">
//             <button
//               type="button"
//               className="btn btn-secondary"
//               onClick={onCancel}
//               disabled={isLoading}
//             >
//               Cancelar
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" />
//                   {isEditing ? 'Actualizando...' : 'Creando...'}
//                 </>
//               ) : (
//                 isEditing ? 'Actualizar' : 'Crear'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

export const BitacoraFilters: React.FC<{
  onFilterChange: (filters: { tipo?: string; search?: string }) => void;
}> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState<{ tipo?: string; search?: string }>({});

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="search" className="form-label">Buscar</label>
            <input
              type="text"
              className="form-control"
              id="search"
              placeholder="Buscar en títulos y descripciones..."
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="tipoFilter" className="form-label">Filtrar por tipo</label>
            <select
              className="form-select"
              id="tipoFilter"
              onChange={(e) => handleFilterChange('tipo', e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="INFO">Información</option>
              <option value="WARNING">Advertencia</option>
              <option value="ERROR">Error</option>
              <option value="SUCCESS">Éxito</option>
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setFilters({});
                onFilterChange({});
              }}
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
