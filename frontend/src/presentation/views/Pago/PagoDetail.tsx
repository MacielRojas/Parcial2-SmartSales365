import type { PagoEntity } from "../../../domain/entities/Pago_entity";

interface Props {
  pago: PagoEntity;
  onVolver: () => void;
}

export const DetallePago = ({ pago, onVolver }: Props) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center mb-4">
            <button 
              className="btn btn-outline-secondary btn-sm me-3"
              onClick={onVolver}
            >
              ← Volver
            </button>
            <h2 className="h4 mb-0">Detalle del Pago</h2>
          </div>

          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">Información del Pago</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-sm-6 mb-3">
                      <label className="form-label fw-semibold text-muted small mb-1">
                        ID del Pago
                      </label>
                      <p className="fw-bold">#{pago.id}</p>
                    </div>
                    
                    <div className="col-12 col-sm-6 mb-3">
                      <label className="form-label fw-semibold text-muted small mb-1">
                        Estado
                      </label>
                      <div>
                        <span 
                          className={`badge ${
                            pago.estado === 'completado' ? 'bg-success' :
                            pago.estado === 'pendiente' ? 'bg-warning' :
                            pago.estado === 'fallido' ? 'bg-danger' : 'bg-secondary'
                          }`}
                        >
                          {pago.estado}
                        </span>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 mb-3">
                      <label className="form-label fw-semibold text-muted small mb-1">
                        Monto
                      </label>
                      <p className="fw-bold fs-5 text-success">
                        {pago.monto.toFixed(2)} {pago.moneda.toUpperCase()}
                      </p>
                    </div>

                    <div className="col-12 col-sm-6 mb-3">
                      <label className="form-label fw-semibold text-muted small mb-1">
                        Moneda
                      </label>
                      <p>
                        <span className="badge bg-secondary">
                          {pago.moneda.toUpperCase()}
                        </span>
                      </p>
                    </div>

                    <div className="col-12 col-sm-6 mb-3">
                      <label className="form-label fw-semibold text-muted small mb-1">
                        ID del Carrito
                      </label>
                      <p className="fw-bold">#{pago.carrito}</p>
                    </div>

                    <div className="col-12 col-sm-6 mb-3">
                      <label className="form-label fw-semibold text-muted small mb-1">
                        Payment Method ID
                      </label>
                      <p className="font-monospace small">
                        {pago.payment_method_id}
                      </p>
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label fw-semibold text-muted small mb-1">
                        Payment Intent
                      </label>
                      <p className="font-monospace small">
                        {pago.payment_intent}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="card">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">Información de Fechas</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Creado
                    </label>
                    <p className="mb-2">
                      {pago.created_at?.toString().slice(0,10)}
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Actualizado
                    </label>
                    <p className="mb-2">
                      {pago.updated_at?.toString().slice(0,10)}
                    </p>
                  </div>

                  {pago.deleted_at && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-muted small mb-1">
                        Eliminado
                      </label>
                      <p className="mb-2 text-danger">
                        {pago.deleted_at?.toString().slice(0,10)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Vista Mobile Compacta */}
          <div className="d-block d-lg-none">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Resumen Rápido</h5>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Estado:</span>
                  <span 
                    className={`badge ${
                      pago.estado === 'completado' ? 'bg-success' :
                      pago.estado === 'pendiente' ? 'bg-warning' :
                      pago.estado === 'fallido' ? 'bg-danger' : 'bg-secondary'
                    }`}
                  >
                    {pago.estado}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Monto:</span>
                  <span className="fw-bold text-success">
                    {pago.monto} {pago.moneda.toUpperCase()}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Fecha:</span>
                  <span className="small">
                    {pago.created_at?.toString().slice(0,10)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};