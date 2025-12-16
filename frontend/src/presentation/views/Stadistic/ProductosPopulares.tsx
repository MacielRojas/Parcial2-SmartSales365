import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import type { DashboardStats } from './Stadistic';

interface TopProductsProps {
  stats: DashboardStats;
}

export const TopProducts: React.FC<TopProductsProps> = ({ stats }) => {
  return (
    <Card className="h-100">
      <Card.Header>
        <h5 className="mb-0">Productos Más Vendidos</h5>
      </Card.Header>
      <Card.Body className="p-0">
        <ListGroup variant="flush">
          {stats.productos_populares.map((producto, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <span className="badge bg-primary me-3">{index + 1}</span>
                <span>{producto.producto}</span>
              </div>
              <Badge bg="success" pill>
                {producto.ventas.toString()} ventas
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};