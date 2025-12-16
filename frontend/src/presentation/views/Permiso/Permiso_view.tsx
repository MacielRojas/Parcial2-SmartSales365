import { PermisoEntity } from '../../../domain/entities/Permiso_entity';
import PermisoForm from './Permiso_form';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import PermisoTable from './Permiso_table';
import { useState } from 'react';
import { PermisoHook } from './Permiso_hook';
import Loading from '../../components/loading';

function Permiso() {
  const {
    loading,
    // message,
    filtered,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = PermisoHook();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<PermisoEntity | undefined>(undefined);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-3">Gestión de Permiso</h1>

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
          Crear Permiso
        </button>
      </div>

      <div className="container py-5">
        <PermisoTable
          Permiso={filtered}
          editItem={(item) => { setShowModal(true); setEditingItem(item); }}
          deleteItem={(item) => { handleDelete(item.id?.toString() ?? ''); setShowModal(false); }}
        />
      </div>

      {showModal && (
        <Modal
          title={editingItem ? `Editar Permiso` : `Crear Permiso`}
          onClose={() => setShowModal(false)}
        >
          <PermisoForm
            initialPermiso={editingItem}
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

export default Permiso;
