import React from 'react';
import { Card, Table, Badge, ProgressBar, Button } from 'react-bootstrap';

interface PredictionData {
  success: boolean;
  prediccion?: {
    monto_estimado: number;
    moneda: string;
    confianza: string;
    user_id: number;
    total_productos: number;
    total_items: number;
  };
  error?: string;
}

interface PredictionsTableProps {
  predictions: PredictionData[];
  onRefresh?: () => void;
  loading?: boolean;
}

export const PredictionsTable: React.FC<PredictionsTableProps> = ({ 
  predictions, 
  onRefresh, 
  loading = false 
}) => {
  const getConfidenceVariant = (confianza: string) => {
    switch (confianza) {
      case 'alta': return 'success';
      case 'media': return 'warning';
      case 'baja': return 'danger';
      default: return 'secondary';
    }
  };

  const getConfidencePercentage = (confianza: string) => {
    switch (confianza) {
      case 'alta': return 85;
      case 'media': return 65;
      case 'baja': return 45;
      default: return 50;
    }
  };

  // Filtrar solo las predicciones exitosas
  const successfulPredictions = predictions.filter(p => p.success && p.prediccion);

  if (loading) {
    return (
      <Card className="h-100">
        <Card.Header>
          <h5 className="mb-0">Predicciones de Ventas - Random Forest</h5>
        </Card.Header>
        <Card.Body className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 mb-0">Cargando predicciones...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Predicciones de Ventas - Random Forest</h5>
        {onRefresh && (
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        {successfulPredictions.length === 0 ? (
          <div className="text-center text-muted py-4">
            <p>No hay predicciones disponibles</p>
            <small>Realiza una predicción para ver los resultados</small>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Usuario ID</th>
                  <th>Monto Estimado</th>
                  <th>Productos</th>
                  <th>Items</th>
                  <th>Confianza</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {successfulPredictions.map((prediction, index) => (
                  <tr key={index}>
                    <td>
                      <Badge bg="secondary">
                        User #{prediction.prediccion!.user_id}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="primary">
                        {prediction.prediccion!.moneda} {prediction.prediccion!.monto_estimado.toLocaleString()}
                      </Badge>
                    </td>
                    <td>
                      <strong>{prediction.prediccion!.total_productos}</strong> productos
                    </td>
                    <td>
                      <strong>{prediction.prediccion!.total_items}</strong> items
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <ProgressBar 
                          now={getConfidencePercentage(prediction.prediccion!.confianza)} 
                          variant={getConfidenceVariant(prediction.prediccion!.confianza)}
                          className="flex-grow-1 me-2"
                          style={{ minWidth: '80px' }}
                        />
                        <small className="text-capitalize">{prediction.prediccion!.confianza}</small>
                      </div>
                    </td>
                    <td>
                      {new Date().toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        
        {/* Mostrar errores si los hay */}
        {predictions.some(p => !p.success) && (
          <div className="mt-3">
            <h6>Predicciones con errores:</h6>
            <div className="alert alert-warning py-2">
              <small>
                {predictions
                  .filter(p => !p.success)
                  .map((p, index) => (
                    <div key={index}>❌ {p.error}</div>
                  ))
                }
              </small>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};