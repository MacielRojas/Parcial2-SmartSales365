import { UserRolEntity } from '../../../domain/entities/UserRol_entity';
import UserRolForm from './UserRol_form';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import UserRolTable from './UserRol_table';
import { useState } from 'react';
import { UserRolHook } from './UserRol_hook';
import Loading from '../../components/loading';

function UserRol() {
  const {
    loading,
    filtered,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = UserRolHook();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<UserRolEntity | undefined>(undefined);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-3">Gestión de UserRol</h1>

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
          Crear UserRol
        </button>
      </div>

      <div className="container py-5">
        <UserRolTable
          UserRol={filtered}
          editItem={(item) => { setShowModal(true); setEditingItem(item); }}
          deleteItem={(item) => { handleDelete(item.id?.toString() ?? ''); setShowModal(false); }}
        />
      </div>

      {showModal && (
        <Modal
          title={editingItem ? `Editar UserRol` : `Crear UserRol`}
          onClose={() => setShowModal(false)}
        >
          <UserRolForm
            initialUserRol={editingItem}
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

export default UserRol;
