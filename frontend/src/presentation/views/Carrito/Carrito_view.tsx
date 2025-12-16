import { CarritoEntity } from '../../../domain/entities/Carrito_entity';
import CarritoForm from './Carrito_form';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import CarritoTable from './Carrito_table';
import { useState } from 'react';
import { CarritoHook } from './Carrito_hook';
import Loading from '../../components/loading';

function Carrito() {
  const {
    loading,
    // message,
    filtered,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = CarritoHook();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CarritoEntity | undefined>(undefined);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-3">Gestión de Carrito</h1>

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
          Crear Carrito
        </button>
      </div>

      <div className="container py-5">
        <CarritoTable
          Carrito={filtered}
          editItem={(item) => { setShowModal(true); setEditingItem(item); }}
          deleteItem={(item) => { handleDelete(item.id?.toString() ?? ''); setShowModal(false); }}
        />
      </div>

      {showModal && (
        <Modal
          title={editingItem ? `Editar Carrito` : `Crear Carrito`}
          onClose={() => setShowModal(false)}
        >
          <CarritoForm
            initialCarrito={editingItem}
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

export default Carrito;
