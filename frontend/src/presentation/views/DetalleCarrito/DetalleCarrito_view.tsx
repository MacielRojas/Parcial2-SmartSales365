import { DetalleCarritoEntity } from '../../../domain/entities/DetalleCarrito_entity';
import DetalleCarritoForm from './DetalleCarrito_form';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import DetalleCarritoTable from './DetalleCarrito_table';
import { useState } from 'react';
import { DetalleCarritoHook } from './DetalleCarrito_hook';
import Loading from '../../components/loading';

function DetalleCarrito() {
  const {
    loading,
    // message,
    filtered,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = DetalleCarritoHook();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DetalleCarritoEntity | undefined>(undefined);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-3">Gestión de DetalleCarrito</h1>

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
          Crear DetalleCarrito
        </button>
      </div>

      <div className="container py-5">
        <DetalleCarritoTable
          DetalleCarrito={filtered}
          editItem={(item) => { setShowModal(true); setEditingItem(item); }}
          deleteItem={(item) => { handleDelete(item.id?.toString() ?? ''); setShowModal(false); }}
        />
      </div>

      {showModal && (
        <Modal
          title={editingItem ? `Editar DetalleCarrito` : `Crear DetalleCarrito`}
          onClose={() => setShowModal(false)}
        >
          <DetalleCarritoForm
            initialDetalleCarrito={editingItem}
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

export default DetalleCarrito;
