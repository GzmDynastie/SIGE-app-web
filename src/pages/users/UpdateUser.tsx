import Sidebar from "../../components/Sidebar";
import Button from "../../components/Button";
import Alert from "../../components/Alert";
import Select from "../../components/Select";
import Loading from "../../components/Loading";
import styles from "../../styles/pages/Tickets.module.css";
import { Eye, EyeClosed } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Role } from "../../types/User";
import { UserRepository } from "../../repositories/users/UserRepository";

const UpdateUser: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [formData, setFormData] = useState<User>({
        id_user: 0,
        tuition: "",
        name: "",
        last_name: "",
        email: "",
        password: "",
        role: 0,
        status: false,
    });

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const roleOptions = Object.values(Role).map((label, index) => ({
        value: index,
        label,
    }));

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            try {
                const user = await new UserRepository().getUserById(parseInt(id));
                if (user) setFormData(user);
                else setErrorMessage("Usuario no encontrado.");
            } catch (error) {
                setErrorMessage("Error al cargar el usuario.");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
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
            await new UserRepository().updateUser(parseInt(id), formData);
            setSuccessMessage("Usuario actualizado correctamente.");
            setTimeout(() => navigate("/auth/users"), 2000);
        } catch (error) {
            setErrorMessage("Error al actualizar el usuario.");
            setTimeout(() => setErrorMessage(null), 3000);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className={styles.body}>
            <div className={styles.cont}>
                <Sidebar />
                <div className="container" style={{ marginTop: "50px" }}>
                    {successMessage && <Alert text={successMessage} iconVariant="success" variant="alert alert-success" />}
                    {errorMessage && <Alert text={errorMessage} iconVariant="error" variant="alert alert-danger" />}
                    <h1>Editar Usuario</h1>
                    <hr style={{ border: "1px solid" }} />

                    <div className="row g-3">
                        <div className="col">
                            <label className="form-label"><strong>Nombre</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        <div className="col">
                            <label className="form-label"><strong>Apellido</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.last_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="row g-3 mt-3">
                        <div className="col">
                            <label className="form-label"><strong>Email</strong></label>
                            <input
                                type="email"
                                className="form-control"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>

                        <div className="col">
                            <label className="form-label"><strong>Contraseña</strong></label>
                            <div className="d-flex align-items-center">
                                <div className="input-group" style={{ flex: 1 }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        value={formData.password}
                                        readOnly
                                        style={{ backgroundColor: "white", color: "black", opacity: 1 }}
                                    />
                                    <button
                                        className="btn btn-outline-secondary rounded-end"
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                    >
                                        {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mt-3">
                        <div className="col">
                            <label className="form-label"><strong>Rol</strong></label>
                            <Select
                                data={roleOptions}
                                option={{ key: "value", label: "label" }}
                                onChange={(selected) =>
                                    setFormData((prev) => ({ ...prev, role: selected.value }))
                                }
                            />
                        </div>
                    </div>

                    <div className="mt-4" style={{ textAlign: "end" }}>
                        <span style={{ marginRight: "20px" }}>
                            <Button text="Cancelar" size="md" variant="danger" onClick={() => navigate("/auth/users")} />
                        </span>
                        <span>
                            <Button text="Guardar" size="md" variant="success" onClick={handleSubmit} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateUser;
