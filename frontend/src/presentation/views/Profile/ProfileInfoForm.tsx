import type React from "react";
import type { User } from "../../../domain/entities/Usuario";
import UserForm from "../usuario/Form";

interface ProfileInfoFormProps {
  user: User;
  onSave: (user: any) => void;
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({ user, onSave, }) => {
  
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h5 className="mb-3">
          <i className="bi bi-person me-2"></i> Información Personal
        </h5>
        <UserForm initialUser={user} onSubmit={onSave} />
      </div>
    </div>
  );
};

export default ProfileInfoForm;
