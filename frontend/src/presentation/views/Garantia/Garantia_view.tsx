import { GarantiaEntity } from '../../../domain/entities/Garantia_entity';
import GarantiaForm from './Garantia_form';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import GarantiaTable from './Garantia_table';
import { useState } from 'react';
import { GarantiaHook } from './Garantia_hook';
import Loading from '../../components/loading';

function Garantia() {
  const {
    loading,
    // message,
    filtered,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = GarantiaHook();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<GarantiaEntity | undefined>(undefined);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-3">Gestión de Garantia</h1>

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
          Crear Garantia
        </button>
      </div>

      <div className="container py-5">
        <GarantiaTable
          Garantia={filtered}
          editItem={(item) => { setShowModal(true); setEditingItem(item); }}
          deleteItem={(item) => { handleDelete(item.id?.toString() ?? ''); setShowModal(false); }}
        />
      </div>

      {showModal && (
        <Modal
          title={editingItem ? `Editar Garantia` : `Crear Garantia`}
          onClose={() => setShowModal(false)}
        >
          <GarantiaForm
            initialGarantia={editingItem}
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

export default Garantia;
