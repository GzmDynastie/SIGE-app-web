import Sidebar from "../../components/Sidebar";
import Select from "../../components/Select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Priority, Status, Category } from "../../types/Ticket";
import { Area, getArea } from "../../types/Area";
import { useTickets } from "../../hooks/useTickets";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import styles from "../../styles/pages/Tickets.module.css";
import { useUser } from "../../hooks/useUser";
import { useAreas } from "../../hooks/useAreas";
import { User } from "../../types/User";

const CreateTicket: React.FC = () => {
    const navigate = useNavigate();

    const { error: ticketError, loading: ticketLoading, createTicket } = useTickets();
    const { users: userData, error: userError, loading: userLoading, getAllUsers } = useUser();
    const { areas: areaData, getAllAreas } = useAreas();

    const [successMessage, setSuccessMessage] = useState<String | null>(null);
    const [errorMessage, setErrorMessage] = useState<String | null>(null);

    useEffect(() => {
        getAllAreas();
        getAllUsers();
    }, []);

    useEffect(() => {
        if (userData.length > 0 && formData.id_technical === 0) {
            setFormData((prevState) => ({
                ...prevState,
                id_technical: userData[0].id_user,
            }));
        }
        if (areaData.length > 0 && formData.id_area === 0) {
            setFormData((prevState) => ({
                ...prevState,
                id_area: areaData[0].id_area,
            }));
        }
    }, [userData, areaData]);

    const [formData, setFormData] = useState({
        category: Category.Incidente,
        status: Status.Abierto,
        communication: "",
        report: "",
        priority: Priority.Baja,
        applicant: "",
        id_technical: userData.length > 0 ? userData[0].id_user : 0,
        id_area: areaData.length > 0 ? areaData[0].id_area : 0,
    });

    const statusOptions = Object.values(Status);
    const priorityOptions = Object.values(Priority);
    const categoryOptions = Object.values(Category);

    const uniqueAreas = Array.from(
        new Map(
            (areaData).map(area => [getArea(area), area])
        ).values()
    );

    const handleSubmit = async () => {
        console.log(formData);

        const newTicket = {
            category: formData.category,
            status: formData.status,
            communication: formData.communication,
            report: formData.report,
            priority: formData.priority,
            applicant: formData.applicant,
            id_area: formData.id_area,
            id_technical: formData.id_technical,
        };

        try {
            for (let i = 0; i < Object.values(newTicket).length; i++) {
                if (Object.values(newTicket)[i] === "") {
                    setErrorMessage("Debe llenar todos los campos.");
                    setTimeout(() => setErrorMessage(null), 3000);
                    return;
                }
            }
            await createTicket(newTicket);
            setSuccessMessage("Ticket credo exitosamente.");
            setTimeout(() => navigate("/auth/ticket"), 2000);
        } catch (error) {
            setErrorMessage("Error al crear el ticket.");
            setTimeout(() => setErrorMessage(null), 3000);
        }
    }

    if (ticketLoading || userLoading) return <Loading />;

    if (ticketError || userError) {
        const errorMessage = [ticketError && `Tickets -> ${ticketError}`, userError && `Users -> ${userError}`]
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
                    <h1>Crear Ticket</h1>
                    <hr style={{ border: "1px solid" }} />
                    <div className="row g-3">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label"><strong>Prioridad</strong></label>
                                <Select
                                    data={priorityOptions.map((item) => ({ value: item, label: item }))}
                                    option={{ key: "value", label: "label" }}
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, priority: selected.value })
                                        )}
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label"><strong>Estatus</strong></label>
                                <Select
                                    data={statusOptions.map((item) => ({ value: item, label: item }))}
                                    option={{ key: "value", label: "label" }}
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, status: selected.value })
                                        )}
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label"><strong>Categoria</strong></label>
                                <Select
                                    data={categoryOptions.map((item) => ({ value: item, label: item }))}
                                    option={{ key: "value", label: "label" }}
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, category: selected.value })
                                        )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row g-3">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label"><strong>Áreas</strong></label>
                                <Select
                                    data={uniqueAreas}
                                    option={{ key: "id_area", label: (area: Area) => getArea(area) }}
                                    onChange={(selected: Area) => {
                                        setFormData((prev) => ({ ...prev, id_area: selected.id_area }));
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row g-3">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label"><strong>Técnico</strong></label>
                                <Select
                                    data={userData}
                                    option={{ key: "id_user", label: (user) => `${user.name} ${user.last_name}` }}
                                    onChange={(selected: User) =>
                                        setFormData((prev) => ({ ...prev, id_technical: selected.id_user })
                                        )}
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label"><strong>Solicitante</strong></label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="exampleFormControlInput1"
                                    placeholder="ejem. Juanito Perez"
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, applicant: e.target.value })
                                        )}
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label"><strong>Contacto</strong></label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="exampleFormControlInput1"
                                    placeholder="name@example.com"
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, communication: e.target.value })
                                        )}
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
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, report: e.target.value })
                                        )}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <hr style={{ border: "1px solid" }} />
                    </div>

                    <div style={{ textAlign: "end" }}>
                        <span style={{ marginRight: "20px" }}><Button text="Guardar datos" size="md" variant="secondary active" onClick={handleSubmit} /></span>
                        <Button text="Cancelar" size="md" variant="danger" onClick={() => navigate("/auth/dashboard")} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateTicket;
