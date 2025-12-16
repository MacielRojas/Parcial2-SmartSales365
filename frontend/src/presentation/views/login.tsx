import { useEffect, useState } from "react";
import { EmailField, PasswordField } from "../components/fields";
import { APIGateway } from "../../infraestructure/services/APIGateway";
import { AuthUseCase } from "../../application/usecases/Auth_uc";
import { useNavigate } from "react-router-dom";
import Loading from "../components/loading";

type LoginProps = {
    email: string;
    password: string;
    loading: boolean;
    message?: string;
};

const Login = () => {
    const [state, setState] = useState<LoginProps>({
        email: '',
        password: '',
        loading: false,
        message: '',
    })

    const auth_uc = new AuthUseCase(new APIGateway());
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setState({ ...state, loading: true, message: 'Cargando' });
        try {
            // Lógica para iniciar sesión
            const email = state.email;
            const password = state.password;
            const response = await auth_uc.login({ email, password });
            if (!response) {
                throw Error(`Error iniciando sesión`);
            } else {
                setState({ ...state, message: '✅ Sesión iniciada' });
                navigate('/dashboard');
                // recargo la pagina
                window.location.reload();
            }
        } catch (error) {
            setState({ ...state, message: `Error iniciando sesión` });
        } finally {
            setState({ ...state, loading: false });
        }
    };

    useEffect(() => {
        localStorage.clear();
    }, []);

    if (state.loading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shado-lg border-0" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-body p-4">
                    <h3 className='card-title text-center mb-4 fw-label'>Iniciar Sesión</h3>

                    <form onSubmit={handleSubmit}>
                        <EmailField value={state.email} onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))} />
                        <PasswordField value={state.password} onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))} />
                        {!state.loading && (
                            <button type="button" className="btn btn-primary w-100 mb-3" onClick={handleSubmit}>
                                Iniciar Sesión
                            </button>
                        )}
                    </form>
                    <p className="text-center text-muted small mb-0">
                        ¿No tienes una cuenta?
                    </p>
                    <button type="button" className="btn btn-link w-100 mb-3" onClick={() => navigate('/register')}>
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
