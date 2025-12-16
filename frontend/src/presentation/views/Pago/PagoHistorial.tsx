import { useEffect, useState } from "react";
import Loading from "../../components/loading";
import type { PagoEntity } from "../../../domain/entities/Pago_entity";
import { jwtDecode } from "jwt-decode";
import { APIGateway } from "../../../infraestructure/services/APIGateway";
import { CarritoUseCase } from "../../../application/usecases/Carrito_uc";
import { PagoUseCase } from "../../../application/usecases/Pago_uc";
import { DetallePago } from "./PagoDetail";
import Modal from "../../components/Modal";

export const HistorialPagos = () => {
    const [filtered, setFiltered] = useState<PagoEntity[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [pago, setPago] = useState<PagoEntity | undefined>(undefined);

    const onVerDetalle = (pago: PagoEntity) => {
        setLoading(true);
        try {
            setPago(pago);
            setShowModal(true);
        } catch (error) {
            throw Error(`Error creando Carrito: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleFiltered = async () => {
        setLoading(true);
        try {
            // variables usecases
            const pagouc = new PagoUseCase(new APIGateway());
            const carritouc = new CarritoUseCase(new APIGateway());
            // obtener user_id
            const access = localStorage.getItem("access");
            if (!access) throw Error("Acceso no autorizado");
            const decode: Record<string, any> = jwtDecode(access);
            if (!decode) throw Error("Acceso no autorizado");
            const userId = decode.user_id;

            // obtener carritos
            const carritos = await carritouc.get(`?usuario=${userId}`);
            let newfiltered = await Promise.all(carritos.map(async (carrito: any) => {
                let pago = await pagouc.get(`?carrito=${carrito.id}`);
                if (!pago) throw Error(`Error obteniendo Carrito`);
                return pago[0];
            }));
            newfiltered = newfiltered.filter((pago: PagoEntity) => pago !== undefined) as PagoEntity[];
            setFiltered(newfiltered);
        } catch (error) {
            throw Error(`Error creando Carrito: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFiltered();
    }, []);

    if (loading) {
        return (
            <div>
                <Loading />
            </div>
        );
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <h2 className="h4 mb-4">Historial de Pagos</h2>

                    {showModal && (
                        <Modal title="Detalles del Pago" onClose={() => setShowModal(false)}>
                            <DetallePago pago={pago??{} as PagoEntity} onVolver={() => setShowModal(false)} />
                        </Modal>
                    )}

                    <div className="card">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">ID</th>
                                            <th scope="col">Monto</th>
                                            <th scope="col">Moneda</th>
                                            <th scope="col">Estado</th>
                                            <th scope="col">Fecha</th>
                                            <th scope="col">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((pago) => (
                                            <tr key={pago.id}>
                                                <td className="fw-semibold">#{pago.id}</td>
                                                <td>
                                                    <span className="fw-bold">
                                                        {pago.monto.toFixed(2)} {pago.moneda.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-secondary">
                                                        {pago.moneda.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${pago.estado === 'completado' ? 'bg-success' :
                                                            pago.estado === 'pendiente' ? 'bg-warning' :
                                                                pago.estado === 'fallido' ? 'bg-danger' : 'bg-secondary'
                                                            }`}
                                                    >
                                                        {pago.estado}
                                                    </span>
                                                </td>
                                                <td>
                                                    <small className="text-muted">
                                                        {pago.created_at? pago.created_at.toString().slice(0, 10): ""}
                                                    </small>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-outline-primary btn-sm"
                                                        onClick={() => onVerDetalle(pago)}
                                                    >
                                                        Ver Detalle
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Vista Mobile */}
                    <div className="d-block d-md-none mt-4">
                        <h3 className="h5 mb-3">Pagos Recientes</h3>
                        {filtered.map((pago) => (
                            <div key={pago.id} className="card mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h6 className="card-title mb-0">Pago #{pago.id}</h6>
                                        <span
                                            className={`badge ${pago.estado === 'completado' ? 'bg-success' :
                                                pago.estado === 'pendiente' ? 'bg-warning' :
                                                    pago.estado === 'fallido' ? 'bg-danger' : 'bg-secondary'
                                                }`}
                                        >
                                            {pago.estado}
                                        </span>
                                    </div>

                                    <div className="row">
                                        <div className="col-6">
                                            <small className="text-muted">Monto:</small>
                                            <p className="fw-bold mb-1">
                                                {pago.monto} {pago.moneda.toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-muted">Fecha:</small>
                                            <p className="mb-1">
                                                <small>{pago.created_at? pago.created_at.toString().slice(0, 10):""}</small>
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        className="btn btn-outline-primary btn-sm w-100 mt-2"
                                        onClick={() => onVerDetalle(pago)}
                                    >
                                        Ver Detalles
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};