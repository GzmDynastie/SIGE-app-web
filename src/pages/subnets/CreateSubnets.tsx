import Sidebar from "../../components/Sidebar";
import Button from "../../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import styles from "../../styles/pages/Tickets.module.css";

const CreateSubnets: React.FC = () => {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        vlan: 0,
        initial_range: "",
        end_range: "",
        getway: "",
        description: "",
        number_of_ips: 0,
    });

    const handleSubmit = async () => {
        const hasEmptyFields = Object.values(formData).some(value => value === "" || value === 0);

        if (hasEmptyFields) {
            setErrorMessage("Debe llenar todos los campos.");
            setTimeout(() => setErrorMessage(null), 3000);
            return;
        }

        try {
            console.log("Datos a enviar:", formData);
            // Aquí deberías llamar a tu servicio para guardar la subred
            setSuccessMessage("Subred creada correctamente.");
            setTimeout(() => navigate("/auth/subnets"), 2000);
        } catch (error) {
            setErrorMessage("Error al crear la subred.");
            setTimeout(() => setErrorMessage(null), 3000);
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles[`cont`]}>
                <Sidebar />
                <div className="container" style={{ marginTop: "50px" }}>
                    {successMessage && <Alert text={successMessage} iconVariant="success" variant="alert alert-success" />}
                    {errorMessage && <Alert text={errorMessage} iconVariant="error" variant="alert alert-danger" />}

                    <h1>Registrar Subred</h1>
                    <hr style={{ border: "1px solid" }} />

                    <div className="row g-3">
                        <div className="col">
                            <label className="form-label"><strong>VLAN</strong></label>
                            <input
                                type="number"
                                className="form-control"
                                value={formData.vlan}
                                onChange={(e) => setFormData(prev => ({ ...prev, vlan: parseInt(e.target.value) }))}
                            />
                        </div>

                        <div className="col">
                            <label className="form-label"><strong>Rango Inicial</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.initial_range}
                                onChange={(e) => setFormData(prev => ({ ...prev, initial_range: e.target.value }))}
                            />
                        </div>

                        <div className="col">
                            <label className="form-label"><strong>Rango Final</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.end_range}
                                onChange={(e) => setFormData(prev => ({ ...prev, end_range: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="row g-3 mt-3">
                        <div className="col">
                            <label className="form-label"><strong>Gateway</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.getway}
                                onChange={(e) => setFormData(prev => ({ ...prev, getway: e.target.value }))}
                            />
                        </div>

                        <div className="col">
                            <label className="form-label"><strong>Descripción</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        <div className="col">
                            <label className="form-label"><strong>Número de IPs</strong></label>
                            <input
                                type="number"
                                className="form-control"
                                value={formData.number_of_ips}
                                onChange={(e) => setFormData(prev => ({ ...prev, number_of_ips: parseInt(e.target.value) }))}
                            />
                        </div>
                    </div>

                    <div className="mt-4" style={{ textAlign: "end" }}>
                        <span style={{ marginRight: "20px" }}>
                            <Button text="Guardar" size="md" variant="secondary active" onClick={handleSubmit} />
                        </span>
                        <span>
                            <Button text="Cancelar" size="md" variant="danger" onClick={() => navigate("/auth/subnets")} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSubnets;