import { GaleriaEntity } from '../../../domain/entities/Galeria_entity';
import GaleriaForm from './Galeria_form';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import GaleriaTable from './Galeria_table';
import { useState } from 'react';
import { GaleriaHook } from './Galeria_hook';
import Loading from '../../components/loading';

function Galeria() {
  const {
    loading,
    // message,
    filtered,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = GaleriaHook();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<GaleriaEntity | undefined>(undefined);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-3">Gestión de Galeria</h1>

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
          Crear Galeria
        </button>
      </div>

      <div className="container py-5">
        <GaleriaTable
          Galeria={filtered}
          editItem={(item) => { setShowModal(true); setEditingItem(item); }}
          deleteItem={(item) => { handleDelete(item.id?.toString() ?? ''); setShowModal(false); }}
        />
      </div>

      {showModal && (
        <Modal
          title={editingItem ? `Editar Galeria` : `Crear Galeria`}
          onClose={() => setShowModal(false)}
        >
          <GaleriaForm
            initialGaleria={editingItem}
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

export default Galeria;
