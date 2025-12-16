import React from "react";

interface ProfileHeaderProps {
  name: string;
  email: string;
  rol: string[];
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email, rol }) => {
  return (
    <div className="card-header bg-primary text-white py-4 d-flex flex-column flex-md-row align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <img
          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${name}`}
          alt="Avatar"
          className="rounded-circle me-3"
          style={{ width: "70px", height: "70px", background: "#fff" }}
        />
        <div>
          <h5 className="mb-0 fw-bold">{name}</h5>
          <small>{email}</small>
          <div className="text-light small mt-1">{rol?rol.join(", "):""}</div>
        </div>
      </div>
      <button className="btn btn-light mt-3 mt-md-0">
        <i className="bi bi-pencil me-1"></i> Editar Foto
      </button>
    </div>
  );
};

export default ProfileHeader;
