import { User } from '../../../domain/entities/Usuario';
import UserForm from './Form';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import Table from './Table'; // Asegúrate que el nombre coincida
import { useState } from 'react';
import { UserHook } from './UsuarioHook';
import Loading from '../../components/loading';

function Usuarios() {
  const {
    loading,
    // message,
    filtered,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = UserHook();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

  if (loading) {
    return (
      <div>
        <Loading />
    </div>
  );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-3">Gestión de Usuarios</h1>

      {/* Buscador */}
      <div className="mb-4">
        <SearchBar onSearch={(term)=>handleSearch(term)}/>
      </div>

      {/* Botón de creación */}
      <div className="d-flex justify-content-end mb-3 flex-wrap">
        <button className="btn btn-primary mb-2" onClick={
          ()=> {
            setEditingUser(undefined);
            setShowModal(true);
          }
        }>
          <i className="bi bi-person-plus me-2"></i>
          Crear Usuario
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className="container py-5">
        <Table 
        users={filtered} 
        editUser={(user)=> {setShowModal(true); setEditingUser(user);}} 
        deleteUser={(user) => {handleDelete(user.id?.toString()??"",); setShowModal(false);}}
        />
      </div>

      {showModal && (
        <Modal title={editingUser ? "Editar Usuario" : "Crear Usuario"} onClose={() => setShowModal(false)}>
          <UserForm 
          initialUser={editingUser} 
          onSubmit={
            (user) => {
              editingUser ? handleUpdate(user.id?.toString()??"", user) : handleCreate(user); 
              setShowModal(false);
            }
          } 
          onCancel={() => setShowModal(false)}/>
        </Modal>
      )}
    </div>
  );
}

export default Usuarios;