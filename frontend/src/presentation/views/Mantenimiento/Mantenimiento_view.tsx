import { MantenimientoEntity } from '../../../domain/entities/Mantenimiento_entity';
import MantenimientoForm from './Mantenimiento_form';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import MantenimientoTable from './Mantenimiento_table';
import { useState } from 'react';
import { MantenimientoHook } from './Mantenimiento_hook';
import Loading from '../../components/loading';

function Mantenimiento() {
  const {
    loading,
    // message,
    filtered,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = MantenimientoHook();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MantenimientoEntity | undefined>(undefined);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-3">Gestión de Mantenimiento</h1>

      <div className="mb-4">
        <SearchBar onSearch={(term) => handleSearch(term)} />
      </div>

      <div className="d-flex justify-content-end mb-3 flex-wrap">
        <button
          className="btn btn-primary mb-2"
          onClick={() => {
            setEditingItem(undefined);
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Crear Mantenimiento
        </button>
      </div>

      <div className="container py-5">
        <MantenimientoTable
          Mantenimiento={filtered}
          editItem={(item) => { setShowModal(true); setEditingItem(item); }}
          deleteItem={(item) => { handleDelete(item.id?.toString() ?? ''); setShowModal(false); }}
        />
      </div>

      {showModal && (
        <Modal
          title={editingItem ? `Editar Mantenimiento` : `Crear Mantenimiento`}
          onClose={() => setShowModal(false)}
        >
          <MantenimientoForm
            initialMantenimiento={editingItem}
            onSubmit={(item) => {
              editingItem
                ? handleUpdate(item.id?.toString() ?? '', item)
                : handleCreate(item);
              setShowModal(false);
            }}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default Mantenimiento;
