import Sidebar from "../../components/Sidebar";
import Button from "../../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import styles from "../../styles/pages/Tickets.module.css";
import { User, Role } from "../../types/User";
import { UserRepository } from "../../repositories/users/UserRepository";
import { Eye, EyeClosed } from "lucide-react";
import Select from "../../components/Select";
import emailjs from '@emailjs/browser';

const CreateUser: React.FC = () => {

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        email: "",
        password: "",
        role: 0,
    });
    const roleOptions = Object.values(Role).map((label, index) => ({
        value: index,
        label,
    }));
    console.log(formData.role)



    //Envio de documento con emailjs
    const sendWelcomeEmail = async (email: string, password: string, name: string) => {
        const templateParams = {
            user_email: email,
            user_password: password,
            name: name, // 👈 
        };

        console.log("templateParams:", templateParams); // para depurar

        try {
            await emailjs.send(
                "service_l31mts9",        // tu Service ID
                "template_vongg9l",       // tu Template ID
                templateParams,
                "-UICBNEQ-zRQk1mfp"       // tu Public Key
            );
            console.log("Correo enviado correctamente");
        } catch (error: any) {
            console.error("Error al enviar el correo:", error?.text || error);
        }
    };


    const handleSubmit = async () => {
        const hasEmptyFields = Object.values(formData).some(value => value === "" || value === 0);

        if (hasEmptyFields) {
            setErrorMessage("Debe llenar todos los campos.");
            setTimeout(() => setErrorMessage(null), 3000);
            return;
        }

        try {
            await new UserRepository().createUser(formData as Omit<User, "id">);

            await sendWelcomeEmail(formData.email, formData.password, formData.name);
            
            setSuccessMessage("Usuario creado correctamente.");
            setTimeout(() => navigate("/auth/users"), 2000);
        } catch (error) {
            setErrorMessage("Error al crear el usuario.");
            setTimeout(() => setErrorMessage(null), 3000);
        }
    };

    const generatePassword = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let newPassword = '';
        for (let i = 0; i < 10; i++) {
            newPassword += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setFormData(prev => ({ ...prev, password: newPassword }));
    };

    return (
        <div className={styles.body}>
            <div className={styles[`cont`]}>
                <Sidebar />
                <div className="container" style={{ marginTop: "50px" }}>
                    {successMessage && <Alert text={successMessage} iconVariant="success" variant="alert alert-success" />}
                    {errorMessage && <Alert text={errorMessage} iconVariant="error" variant="alert alert-danger" />}

                    <h1>Registrar Usuario</h1>
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
                            <label className="form-label">
                                <strong>Contraseña</strong>
                            </label>
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
                                        {showPassword ? < Eye size={20} /> : < EyeClosed size={20} />}
                                    </button>
                                </div>
                                <span style={{ marginLeft: "20px" }}>
                                    <Button text="Generar" size="md" variant="primary" onClick={generatePassword} />
                                </span>
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
                        <span >
                            <Button text="Guardar" size="md" variant="success" onClick={handleSubmit} />
                        </span>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;
