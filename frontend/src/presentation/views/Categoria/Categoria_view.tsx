import { CategoriaEntity } from '../../../domain/entities/Categoria_entity';
import CategoriaForm from './Categoria_form';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import CategoriaTable from './Categoria_table';
import { useState } from 'react';
import { CategoriaHook } from './Categoria_hook';
import Loading from '../../components/loading';

function Categoria() {
  const {
    loading,
    // message,
    filtered,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = CategoriaHook();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CategoriaEntity | undefined>(undefined);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-3">Gestión de Categoria</h1>

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
          Crear Categoria
        </button>
      </div>

      <div className="container py-5">
        <CategoriaTable
          Categoria={filtered}
          editItem={(item) => { setShowModal(true); setEditingItem(item); }}
          deleteItem={(item) => { handleDelete(item.id?.toString() ?? ''); setShowModal(false); }}
        />
      </div>

      {showModal && (
        <Modal
          title={editingItem ? `Editar Categoria` : `Crear Categoria`}
          onClose={() => setShowModal(false)}
        >
          <CategoriaForm
            initialCategoria={editingItem}
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

export default Categoria;
