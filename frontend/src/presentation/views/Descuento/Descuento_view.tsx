import { DescuentoEntity } from '../../../domain/entities/Descuento_entity';
import DescuentoForm from './Descuento_form';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import DescuentoTable from './Descuento_table';
import { useState } from 'react';
import { DescuentoHook } from './Descuento_hook';
import Loading from '../../components/loading';

function Descuento() {
  const {
    loading,
    // message,
    filtered,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = DescuentoHook();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DescuentoEntity | undefined>(undefined);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-3">Gestión de Descuento</h1>

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
          Crear Descuento
        </button>
      </div>

      <div className="container py-5">
        <DescuentoTable
          Descuento={filtered}
          editItem={(item) => { setShowModal(true); setEditingItem(item); }}
          deleteItem={(item) => { handleDelete(item.id?.toString() ?? ''); setShowModal(false); }}
        />
      </div>

      {showModal && (
        <Modal
          title={editingItem ? `Editar Descuento` : `Crear Descuento`}
          onClose={() => setShowModal(false)}
        >
          <DescuentoForm
            initialDescuento={editingItem}
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

export default Descuento;
