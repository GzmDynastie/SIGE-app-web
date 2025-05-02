import Sidebar from "../../components/Sidebar";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";
import styles from "../../styles/pages/Tickets.module.css";
import { Subnet } from "../../types/Subnet";
import { SubnetRepository } from "../../repositories/subnets/SubnetReository";

const UpdateSubnets: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [formData, setFormData] = useState<Subnet>({
        id: 0,
        vlan: 0,
        initial_range: "",
        end_range: "",
        getway: "",
        description: "",
        number_of_ips: 0,
    });

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubnet = async () => {
            if (!id) return;
            try {
                const subnet = await new SubnetRepository().getSubnetById(parseInt(id));
                if (subnet) setFormData(subnet);
                else setErrorMessage("Subred no encontrada");
            } catch (error) {
                setErrorMessage("Error al cargar la subred");
            } finally {
                setLoading(false);
            }
        };
        fetchSubnet();
    }, [id]);

    const handleSubmit = async () => {
        if (!id) {
            setErrorMessage("ID inválido.");
            return;
        }

        const hasEmptyFields = Object.values(formData).some(value => value === "" || value === 0);
        if (hasEmptyFields) {
            setErrorMessage("Debe llenar todos los campos.");
            setTimeout(() => setErrorMessage(null), 3000);
            return;
        }

        try {
            await new SubnetRepository().updateSubnet(parseInt(id), formData);
            setSuccessMessage("Subred actualizada correctamente.");
            setTimeout(() => navigate("/auth/subnets"), 2000);
        } catch (error) {
            setErrorMessage("Error al actualizar la subred.");
            setTimeout(() => setErrorMessage(null), 3000);
        }
    };

    if (loading) return <Loading />;
    if (errorMessage) return <Alert text={errorMessage} iconVariant="error" variant="alert alert-danger" />;

    return (
        <div className={styles.body}>
            <div className={styles[`cont`]}>
                <Sidebar />
                <div className="container" style={{ marginTop: "50px" }}>
                    {successMessage && <Alert text={successMessage} iconVariant="success" variant="alert alert-success" />}

                    <h1>Editar Subred</h1>
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

export default UpdateSubnets;