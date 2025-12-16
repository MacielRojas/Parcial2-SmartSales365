import { useState, useEffect } from "react";
import { UsuarioUseCase } from "../../../application/usecases/usuario_uc";
import { User } from "../../../domain/entities/Usuario"
import { APIGateway } from "../../../infraestructure/services/APIGateway";

type UserHookProps = {
    items: User[];
    loading: boolean;
    message: string;
    filtered: User[];
};

export const UserHook = () => {
    const [state, setState] = useState<UserHookProps>({
        items: [],
        loading: false,
        message: "",
        filtered: [],
    });
    const useruc = new UsuarioUseCase(new APIGateway());

    const loadItems = async () => {
        setState(prev => ({ ...prev, loading: true , message: "Cargando"}));
        try{
            const response = await useruc.get();
            if (!response){
                throw new Error("No se pudo obtener los usuarios");
            }
            const objs = response;
            setState(prev => ({ ...prev, items: objs, filtered: objs}));
        }catch (error:any) {
            setState(prev => ({ ...prev, message: `Error obteniendo usuarios: ${error}`}));
        }finally{
            setState(prev => ({ ...prev, loading: false }));
        }
    }

    const handleCreate = async (data:any) => {
        setState(prev => ({ ...prev, loading: true , message: ""}));
        try{
            const response = await useruc.create(data);
            if (!response){
                throw new Error("No se pudo crear el usuario");
            }
            setState(prev => ({ ...prev, message: "✅ Usuario creado"}));
            await loadItems();
        }catch (error:any) {
            setState(prev => ({ ...prev, message: `Error creando usuario`}));
        }finally{
            setState(prev => ({ ...prev, loading: false }));
        }
    }

    const handleUpdate = async (id: string, data:any) => {
        setState(prev => ({ ...prev, loading: true , message: ""}));
        try{
            const response = await useruc.update(id, data);
            if (!response){
                throw new Error("No se pudo actualizar el usuario");
            }
            setState(prev => ({ ...prev, message: "✅ Usuario actualizado"}));
            await loadItems();
        }catch (error:any) {
            setState(prev => ({ ...prev, message: `Error actualizando usuario`}));
        }finally{
            setState(prev => ({ ...prev, loading: false }));
        }
    }

    const handleDelete = async (id: string) => {
        setState(prev => ({ ...prev, loading: true , message: ""}));
        try{
            const response = await useruc.delete(id);
            if (!response){
                throw new Error("No se pudo eliminar el usuario");
            }
            setState(prev => ({ ...prev, message: "✅ Usuario eliminado"}));
            await loadItems();
        }catch (error:any) {
            setState(prev => ({ ...prev, message: `Error eliminando usuario`}));
        }finally{
            setState(prev => ({ ...prev, loading: false }));
        }
    }

    const handleSearch = async (term: string) => {
        if (!term) {
            setState(prev => ({...prev, filtered: state.items}));
            return;
        }
    
        const lower = term.toLowerCase();
        const results = state.items.filter(
          (u) =>
            u.first_name.toLowerCase().includes(lower) ||
            u.last_name.toLowerCase().includes(lower) ||
            u.username.toLowerCase().includes(lower) ||
            u.email.toLowerCase().includes(lower)
        );
        setState(prev => ({...prev, filtered: results}));
      };

        useEffect(()=>{
            loadItems();
        }, []);

    return {
        ...state,
        handleCreate,
        handleUpdate,
        handleDelete,
        loadItems,
        handleSearch,
    }
};