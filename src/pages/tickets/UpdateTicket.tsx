import Sidebar from "../../components/Sidebar";
import Select from "../../components/Select";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";
import styles from "../../styles/pages/Tickets.module.css"
import { useUser } from "../../hooks/useUser";
import { useTickets } from "../../hooks/useTickets";
import { useAreas } from "../../hooks/useAreas";
import { Status, Priority, Category, Ticket } from "../../types/Ticket";
import { Area, getArea } from "../../types/Area";

const UpdateTicket: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { users: userData, error: userError, loading: userLoading, getAllUsers } = useUser();
    const { error: errorTicket, getTicketById, updateTicket } = useTickets();
    const { areas: areaData, getAllAreas } = useAreas();

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState<String | null>(null);
    const [successMessage, setSuccessMessage] = useState<String | null>(null);

    useEffect(() => {
        const fetchTicket = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const ticketData = await getTicketById(parseInt(id));
                if (!ticketData) {
                    setErrorMessage("El ticket no fue encontrado.");
                    setTimeout(() => navigate("/auth/ticket"), 1500);
                    return;
                }
                console.log("Ticket cargado:", ticketData);
                setTicket(ticketData);
            } catch (error) {
                console.error("Error al obtener el ticket:", error);
                setErrorMessage(`Error al cargar el ticket: ${error}`);
                setTimeout(() => navigate("/auth/ticket"), 1500);
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [id]);


    const [formData, setFormData] = useState<{
        priority: Priority;
        status: Status;
        category: Category;
        id_area: number;
        id_technical: number;
        applicant: string;
        communication: string;
        report: string;
        start_date?: Date | undefined;
        end_date?: Date | undefined;
        solution?: string;
    }>({
        priority: Priority.Baja,
        status: Status.Abierto,
        category: Category.ReporteAula,
        id_area: 0,
        id_technical: 0,
        applicant: "",
        communication: "",
        report: "",
        start_date: undefined,
        end_date: undefined,
        solution: "",
    });

    useEffect(() => {
        if (ticket) {
            setFormData({
                priority: ticket.priority,
                status: ticket.status,
                category: ticket.category,
                id_area: ticket.id_area,
                id_technical: ticket.id_technical,
                applicant: ticket.applicant,
                communication: ticket.communication,
                report: ticket.report,
                start_date: ticket.start_date ? new Date(ticket.start_date) : undefined,
                end_date: ticket.end_date ? new Date(ticket.end_date) : undefined,
                solution: ticket.solution ?? "",
            });
        }
    }, [ticket])

    const handleSubmit = async () => {
        if (!id) {
            setErrorMessage("El ID no es valido.");
            return;
        }

        const hasEmptyFields = Object.entries(formData).some(([key, value]) => {
            if ((key === "start_date" || key === "end_date" || key === "solution") && (value === null || value === "")) {
                return false;
            }
            return value === "";
        });
        if (hasEmptyFields) {
            setErrorMessage("Debe llenar todos los campos.");
            setTimeout(() => setErrorMessage(null), 3000);
            return;
        }

        try {
            console.log("Datos antes de ser guardados:", formData);
            await updateTicket(parseInt(id), formData);
            setSuccessMessage("Ticket actualizado correctamente.")
            setTimeout(() => navigate("/auth/ticket"), 2000);
        } catch (error) {
            setErrorMessage("Error al actualizar el ticket.");
            setTimeout(() => setErrorMessage(null), 3000);
        }
    }

    useEffect(() => {
        getAllUsers();
        getAllAreas();
    }, []);

    const statusOptions = Object.values(Status);
    const priorityOptions = Object.values(Priority);
    const categoryOptions = Object.values(Category);

    const uniqueAreas = Array.from(
        new Map(
            (areaData).map(area => [getArea(area), area])
        ).values()
    );

    if (userLoading || loading) return <Loading />;

    if (userError || errorTicket) {
        const errorMessage = [
            userError && `Users -> ${userError}`,
            errorTicket && `Ticket -> ${errorTicket}`
        ]
            .filter(Boolean)
            .join(" | ");

        return <Alert text={`Error: ${errorMessage}`} variant="alert alert-danger" iconVariant="error" />;
    }

    return (
        <div className={styles.body}>
            <div className={styles[`cont`]}>
                <Sidebar />

                <div className="container" style={{ marginTop: "50px" }}>
                    {successMessage && <Alert text={String(successMessage)} iconVariant="success" variant="alert alert-success" />}
                    {errorMessage && <Alert text={String(errorMessage)} iconVariant="error" variant="alert alert-danger" />}
                    <h1>Edición de ticket: {ticket?.folio}</h1>
                    <hr style={{ border: "1px solid" }} />
                    <div className="row g-3">
                        <div className="col">
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label"><strong>Prioridad</strong></label>
                                <Select
                                    data={priorityOptions.map((item) => ({ value: item, label: item }))}
                                    option={{ key: "value", label: "label" }}
                                    value={formData.priority}
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, priority: selected.value }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label"><strong>Estatus</strong></label>
                                <Select
                                    data={statusOptions.map((item) => ({ value: item, label: item }))}
                                    option={{ key: "value", label: "label" }}
                                    value={formData.status}
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, status: selected.value }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label"><strong>Categoria</strong></label>
                                <Select
                                    data={categoryOptions.map((item) => ({ value: item, label: item }))}
                                    option={{ key: "value", label: "label" }}
                                    value={formData.category}
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, category: selected.value }))
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row g-3">
                        <div className="col">
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label"><strong>Áreas</strong></label>
                                <Select
                                    data={uniqueAreas}
                                    option={{ key: "id_area", label: (area: Area) => getArea(area) }}
                                    value={formData.id_area}
                                    onChange={(selected: Area) =>
                                        setFormData((prev) => ({ ...prev, id_area: selected.id_area }))
                                    }
                                />
                            </div>
                        </div>
                    </div>


                    <div className="row g-3">
                        <div className="col">
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label"><strong>Técnico</strong></label>
                                <Select
                                    data={userData}
                                    option={{ key: "id_user", label: (user) => `${user.name} ${user.last_name}` }}
                                    value={formData.id_technical}
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, id_technical: selected.id_user }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label"><strong>Solicitante</strong></label>
                                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com"
                                    value={formData.applicant}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, applicant: e.target.value }))
                                    } />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label"><strong>Contacto</strong></label>
                                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com"
                                    value={formData.communication}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, communication: e.target.value }))
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row g-3">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlTextarea1" className="form-label">
                                    <strong>Reporte</strong>
                                </label>
                                <textarea
                                    className="form-control"
                                    id="exampleFormControlTextarea1"
                                    rows={3}
                                    value={formData.report}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, report: e.target.value }))
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <hr style={{ border: "1px solid" }} />
                        <h4 style={{ marginBottom: "40px" }}>Solo llenar esta sección cuando el ticket se haya terminado</h4>

                        <div className="row g-3">
                            <div className="col">
                                <div className="mb-3">
                                    <label form="exampleFormControlInput1" className="form-label"><strong>Fecha Inicio</strong></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dateInput"
                                        value={formData.start_date ? formData.start_date.toISOString().split('T')[0] : ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, start_date: new Date(e.target.value) }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col">
                                <div className="mb-3">
                                    <label form="exampleFormControlInput1" className="form-label"><strong>Fecha Termino</strong></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dateInput"
                                        value={formData.end_date ? formData.end_date.toISOString().split('T')[0] : ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, end_date: new Date(e.target.value) }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col">
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlTextarea1" className="form-label">
                                        <strong>Solucion</strong>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="exampleFormControlTextarea1"
                                        rows={3}
                                        value={formData.solution}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, solution: e.target.value }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <hr style={{ border: "1px solid" }} />
                    </div>

                    <div style={{ textAlign: "end" }}>
                        <span style={{ marginRight: "20px" }}><Button
                            text="Guardar datos"
                            size="md"
                            variant="secondary active"
                            onClick={handleSubmit} />
                        </span>
                        <span style={{ marginRight: "20px" }}><Button
                            text="Cancelar"
                            size="md"
                            variant="danger"
                            onClick={() => navigate("/auth/dashboard")} />
                        </span>
                        <Button
                            text="Eliminar"
                            size="md"
                            variant="btn btn-outline-danger" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateTicket;