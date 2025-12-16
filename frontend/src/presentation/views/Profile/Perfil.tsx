import { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileInfoForm from "./ProfileInfoForm";
import ProfilePasswordForm from "./ProfilePasswordForm";
import { User } from "../../../domain/entities/Usuario";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { UsuarioUseCase } from "../../../application/usecases/usuario_uc";
import { APIGateway } from "../../../infraestructure/services/APIGateway";
import Loading from "../../components/loading";

type ProfileViewState = {
  user: User;
  loading: boolean;
};

const ProfileView = () => {
  const [state, setState] = useState<ProfileViewState>({
    user: {} as User,
    loading: false,
  });

  const user_uc = new UsuarioUseCase(new APIGateway());

  const getUser = async () => {
    try {
      
      setState(prev => ({ ...prev, loading: true }));
      const access = localStorage.getItem("access");
      if (!access) throw Error("Acceso no autorizado");
      
      const decode: Record<string, any> = jwtDecode(access);
      if (!decode) throw Error("Acceso no autorizado");

      const id = decode.user_id;
      if (!id) throw Error("Acceso no autorizado");
      
      const user = await user_uc.get(id);
      if (!user) throw Error("Error obteniendo usuario");
      
      setState(prev => ({ ...prev, user: user[0],}));
    } catch (error) {
      toast.error("Error obteniendo usuario");
      throw Error(`Error obteniendo usuario: ${error}`);
    } finally{
      setState(prev => ({ ...prev, loading: false}));
      
    }
  };

  const handleUpdateProfile = async (updatedData: any) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const userupdate: User = await user_uc.update(state.user.id!.toString(), updatedData);
      if (!userupdate) throw Error("Error actualizando usuario");

      setState(prev => ({ ...prev, user: userupdate,}));
      toast.success("Usuario actualizado correctamente");
    } catch (error) {
      toast.error("Error actualizando usuario");
      throw Error(`Error actualizando usuario: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleChangePassword = async (data: { current: string; newPass: string }) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      if (data.current === data.newPass) {
        const userupdate = await user_uc.update(state.user!.id!.toString(), {
          password: data.newPass,
        });
        if (!userupdate) throw Error("Error actualizando contraseña");
        toast.success("Contraseña actualizada correctamente");
      }
      throw Error("Las contraseñas no coinciden");
    } catch (error) {
      toast.error("Error actualizando contraseña");
      throw Error(`Error actualizando contraseña: ${error}`);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (state.loading) {
    
    return (
      <Loading />
    );
  }

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm">
        <ProfileHeader name={`${state.user.first_name} ${state.user.last_name}`} email={state.user.email} rol={state.user.rol} />

        <div className="card-body">
          <div className="row">
            <div className="col-12 col-lg-6 mb-4">
              <ProfileInfoForm user={state.user} onSave={handleUpdateProfile} />
            </div>

            <div className="col-12 col-lg-6">
              <ProfilePasswordForm onChangePassword={handleChangePassword} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
