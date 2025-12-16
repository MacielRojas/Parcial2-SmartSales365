import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Form, InputGroup } from 'react-bootstrap';
import { BitacoraTable2 } from './BitacoraComponents';
import type { BitacoraEntity } from '../../../domain/entities/Bitacora_entity';
import { BitacoraHook } from './Bitacora_hook';
import BitacoraForm from './Bitacora_form';
import Modal from '../../components/Modal';
import Loading from '../../components/loading';

const BitacoraView = () => {
  const bitacorahook = BitacoraHook();

  const [items, setItems] = React.useState<BitacoraEntity[]>(bitacorahook.items);
  const [showForm, setShowForm] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState<string>('ALL');

  // Debug: Log cuando cambien los items del hook
  React.useEffect(() => {
    console.log('🔄 BitacoraView - Items del hook:', bitacorahook.items);
    console.log('🔄 BitacoraView - Cantidad:', bitacorahook.items.length);
    console.log('🔄 BitacoraView - Loading:', bitacorahook.loading);
    setItems(bitacorahook.items);
  }, [bitacorahook.items, bitacorahook.loading]);

  const onSubmit = (item: BitacoraEntity) => {
    bitacorahook.handleCreate(item);
    setShowForm(false);
  };

  // Filtrar items
  const filteredItems = React.useMemo(() => {
    let result = items;
    
    // Filtrar por tipo
    if (selectedFilter !== 'ALL') {
      result = result.filter(item => item.nivel === selectedFilter);
    }
    
    // Filtrar por búsqueda
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.accion?.toLowerCase().includes(lower) ||
        item.ipv4?.toLowerCase().includes(lower) ||
        item.usuario?.toString().includes(lower)
      );
    }
    
    return result;
  }, [items, selectedFilter, searchTerm]);

  // Estadísticas
  const stats = React.useMemo(() => {
    return {
      total: items.length,
      info: items.filter(i => i.nivel === 'INFO').length,
      success: items.filter(i => i.nivel === 'SUCCESS').length,
      warning: items.filter(i => i.nivel === 'WARNING').length,
      error: items.filter(i => i.nivel === 'ERROR').length,
    };
  }, [items]);

  if (bitacorahook.loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">
            <i className="fas fa-book me-2 text-primary"></i>
            Bitácora del Sistema
          </h1>
          <p className="text-muted mb-0">Registro de actividades y eventos</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          disabled={bitacorahook.loading}
        >
          <i className="fas fa-plus-circle me-2"></i>
          Nueva Entrada
        </Button>
      </div>

      {/* Mensaje de información */}
      {bitacorahook.message && (
        <Alert variant="info" dismissible>
          <i className="fas fa-info-circle me-2"></i>
          {bitacorahook.message}
        </Alert>
      )}

      {/* Estadísticas */}
      <Row className="g-3 mb-4">
        <Col md={6} lg={2}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total</h6>
                  <h3 className="mb-0">{stats.total}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-3 p-3">
                  <i className="fas fa-list fa-2x text-primary"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={2}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Info</h6>
                  <h3 className="mb-0 text-info">{stats.info}</h3>
                </div>
                <div className="bg-info bg-opacity-10 rounded-3 p-3">
                  <i className="fas fa-info-circle fa-2x text-info"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={2}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Success</h6>
                  <h3 className="mb-0 text-success">{stats.success}</h3>
                </div>
                <div className="bg-success bg-opacity-10 rounded-3 p-3">
                  <i className="fas fa-check-circle fa-2x text-success"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Warnings</h6>
                  <h3 className="mb-0 text-warning">{stats.warning}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 rounded-3 p-3">
                  <i className="fas fa-exclamation-triangle fa-2x text-warning"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Errors</h6>
                  <h3 className="mb-0 text-danger">{stats.error}</h3>
                </div>
                <div className="bg-danger bg-opacity-10 rounded-3 p-3">
                  <i className="fas fa-times-circle fa-2x text-danger"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filtros y búsqueda */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por acción, IP o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <div className="d-flex gap-2 flex-wrap">
                <Button
                  variant={selectedFilter === 'ALL' ? 'primary' : 'outline-secondary'}
                  size="sm"
                  onClick={() => setSelectedFilter('ALL')}
                >
                  Todos
                </Button>
                <Button
                  variant={selectedFilter === 'INFO' ? 'info' : 'outline-info'}
                  size="sm"
                  onClick={() => setSelectedFilter('INFO')}
                >
                  <i className="fas fa-info-circle me-1"></i>Info
                </Button>
                <Button
                  variant={selectedFilter === 'SUCCESS' ? 'success' : 'outline-success'}
                  size="sm"
                  onClick={() => setSelectedFilter('SUCCESS')}
                >
                  <i className="fas fa-check-circle me-1"></i>Success
                </Button>
                <Button
                  variant={selectedFilter === 'WARNING' ? 'warning' : 'outline-warning'}
                  size="sm"
                  onClick={() => setSelectedFilter('WARNING')}
                >
                  <i className="fas fa-exclamation-triangle me-1"></i>Warning
                </Button>
                <Button
                  variant={selectedFilter === 'ERROR' ? 'danger' : 'outline-danger'}
                  size="sm"
                  onClick={() => setSelectedFilter('ERROR')}
                >
                  <i className="fas fa-times-circle me-1"></i>Error
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Modal para formulario */}
      {showForm && (
        <Modal title="Nueva Entrada de Bitácora" onClose={() => setShowForm(false)}>
          <BitacoraForm
            onSubmit={onSubmit}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}

      {/* Tabla de bitácora */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-list me-2"></i>
              Registros
            </h5>
            <Badge bg="secondary">
              {filteredItems.length} de {items.length}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <BitacoraTable2
            entries={filteredItems}
            isLoading={bitacorahook.loading}
          />
        </Card.Body>
        <Card.Footer className="bg-white">
          <small className="text-muted">
            <i className="fas fa-clock me-1"></i>
            Última actualización: {new Date().toLocaleString()}
          </small>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default BitacoraView;
