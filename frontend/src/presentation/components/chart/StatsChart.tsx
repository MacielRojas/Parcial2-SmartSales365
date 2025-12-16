import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import type { DashboardStats } from '../../views/Stadistic/Stadistic';

interface StatsCardsProps {
  stats: DashboardStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
  };

  return (
    <Row className="g-3 mb-4">
      <Col md={3} sm={6}>
        <Card className="stats-card h-100">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title text-muted mb-2">Ventas Totales</h6>
                <h3 className="mb-0">{formatCurrency(stats.total_ventas)}</h3>
              </div>
              <div className="icon-circle bg-primary">
                <i className="fas fa-dollar-sign text-white"></i>
              </div>
            </div>
            <div className={`mt-2 ${stats.crecimiento_ventas >= 0 ? 'text-success' : 'text-danger'}`}>
              <small>
                <i className={`fas ${stats.crecimiento_ventas >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'} me-1`}></i>
                {Math.abs(stats.crecimiento_ventas)}% vs mes anterior
              </small>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3} sm={6}>
        <Card className="stats-card h-100">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title text-muted mb-2">Ventas del Mes</h6>
                <h3 className="mb-0">{formatCurrency(stats.ventas_mes_actual)}</h3>
              </div>
              <div className="icon-circle bg-success">
                <i className="fas fa-chart-line text-white"></i>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3} sm={6}>
        <Card className="stats-card h-100">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title text-muted mb-2">Total Usuarios</h6>
                <h3 className="mb-0">{stats.total_usuarios}</h3>
              </div>
              <div className="icon-circle bg-info">
                <i className="fas fa-users text-white"></i>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3} sm={6}>
        <Card className="stats-card h-100">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title text-muted mb-2">Total Productos</h6>
                <h3 className="mb-0">{stats.total_productos}</h3>
              </div>
              <div className="icon-circle bg-warning">
                <i className="fas fa-boxes text-white"></i>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};