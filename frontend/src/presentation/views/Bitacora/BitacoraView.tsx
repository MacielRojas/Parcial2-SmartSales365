import React from 'react';
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

  React.useEffect(() => {
    setItems(bitacorahook.items);
  }, [bitacorahook.items]);

  const onSubmit = (item: BitacoraEntity) => {
    bitacorahook.handleCreate(item);
    setShowForm(false);
  };

  if (bitacorahook.loading) {
    return (
      <div >
        <Loading />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3">Bitácora</h1>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
              disabled={bitacorahook.loading}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Entrada
            </button>
          </div>

          {/* Filtros */}
          {/* <BitacoraFilters onFilterChange={state.onFilterChange} /> */}

          <div className="row">
            {/* Formulario */}
            {showForm && (
              <div className="col-lg-4 mb-4">
                <Modal title="Nueva Entrada" onClose={() => setShowForm(false)}>
                  <BitacoraForm
                  onSubmit={onSubmit}
                  onCancel={()=>setShowForm(false)}
                />
                </Modal>
              </div>
            )}

            {/* Tabla */}
            <div className={showForm ? 'col-lg-8' : 'col-12'}>
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Registros de la Bitácora</h5>
                </div>
                <div className="card-body p-0">
                  <BitacoraTable2
                    entries={items}
                    isLoading={bitacorahook.loading}
                    // onEdit={state.onEditEntry}
                    // onDelete={handleDelete}
                    // isLoading={state.isLoading}
                  />
                </div>
                <div className="card-footer">
                  <small className="text-muted">
                    Total: {items.length} registro{items.length !== 1 ? 's' : ''}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitacoraView;
