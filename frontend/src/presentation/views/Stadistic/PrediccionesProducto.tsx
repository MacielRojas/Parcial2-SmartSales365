// components/chart/ProductPredictionsTable.tsx
import React from 'react';
import { Card, Table, Badge, ProgressBar, Button } from 'react-bootstrap';
import type { ProductoPrediction } from './StadisticHook';

interface ProductPredictionsTableProps {
  predictions: ProductoPrediction[];
  onRefresh?: () => void;
  loading?: boolean;
}

export const ProductPredictionsTable: React.FC<ProductPredictionsTableProps> = ({ 
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
  };

  if (loading) {
    return (
      <Card className="h-100">
        <Card.Header>
          <h5 className="mb-0">Predicciones de Ventas por Producto</h5>
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
        <div>
          <h5 className="mb-0">Predicciones de Ventas por Producto</h5>
          <small className="text-muted">Proyección para el próximo mes</small>
        </div>
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
        {predictions.length === 0 ? (
          <div className="text-center text-muted py-4">
            <p>No hay predicciones disponibles</p>
            <small>Entrena el modelo para ver las predicciones</small>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Predicción Ventas</th>
                  <th>Monto Estimado</th>
                  <th>Confianza</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((prediction) => (
                  <tr key={prediction.producto_id}>
                    <td>
                      <div>
                        <strong>{prediction.producto_nombre}</strong>
                        <br />
                        <small className="text-muted">
                          {formatCurrency(prediction.producto_precio)}
                        </small>
                      </div>
                    </td>
                    <td>
                      <Badge bg="secondary" className="text-capitalize">
                        {prediction.categoria}
                      </Badge>
                    </td>
                    <td>
                      <Badge 
                        bg={prediction.stock_actual > 10 ? 'success' : prediction.stock_actual > 5 ? 'warning' : 'danger'}
                      >
                        {prediction.stock_actual} unidades
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <strong className="me-2">
                          {prediction.prediccion_ventas.toFixed(1)}
                        </strong>
                        <small className="text-muted">unidades</small>
                      </div>
                    </td>
                    <td>
                      <Badge bg="primary" className="fs-6">
                        {formatCurrency(prediction.monto_estimado)}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <ProgressBar 
                          now={getConfidencePercentage(prediction.confianza)} 
                          variant={getConfidenceVariant(prediction.confianza)}
                          className="flex-grow-1 me-2"
                          style={{ minWidth: '80px' }}
                        />
                        <small className="text-capitalize">{prediction.confianza}</small>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        
        {/* Resumen */}
        {predictions.length > 0 && (
          <div className="mt-3 pt-3 border-top">
            <div className="row text-center">
              <div className="col-4">
                <h6 className="mb-1">Total Estimado</h6>
                <h5 className="text-primary mb-0">
                  {formatCurrency(predictions.reduce((sum, p) => sum + p.monto_estimado, 0))}
                </h5>
              </div>
              <div className="col-4">
                <h6 className="mb-1">Productos</h6>
                <h5 className="text-success mb-0">{predictions.length}</h5>
              </div>
              <div className="col-4">
                <h6 className="mb-1">Confianza Media</h6>
                <h5 className="text-info mb-0">
                  {((predictions.filter(p => p.confianza === 'alta').length / predictions.length) * 100).toFixed(0)}%
                </h5>
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};