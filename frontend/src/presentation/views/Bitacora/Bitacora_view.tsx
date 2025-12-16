import { BitacoraEntity } from '../../../domain/entities/Bitacora_entity';
import BitacoraForm from './Bitacora_form';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import BitacoraTable from './Bitacora_table';
import { useState } from 'react';
import { BitacoraHook } from './Bitacora_hook';
import Loading from '../../components/loading';

function Bitacora() {
  const {
    loading,
    // message,
    filtered,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = BitacoraHook();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<BitacoraEntity | undefined>(undefined);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-3">Gestión de Bitacora</h1>

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
          Crear Bitacora
        </button>
      </div>

      <div className="container py-5">
        <BitacoraTable
          Bitacora={filtered}
          editItem={(item) => { setShowModal(true); setEditingItem(item); }}
          deleteItem={(item) => { handleDelete(item.id?.toString() ?? ''); setShowModal(false); }}
        />
      </div>

      {showModal && (
        <Modal
          title={editingItem ? `Editar Bitacora` : `Crear Bitacora`}
          onClose={() => setShowModal(false)}
        >
          <BitacoraForm
            initialBitacora={editingItem}
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

export default Bitacora;
