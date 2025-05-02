import Sidebar from "../../components/Sidebar";
import Button from "../../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import styles from "../../styles/pages/Tickets.module.css";
import { useLoans } from "../../hooks/useLoans";

const CreateLoan: React.FC = () => {
  const navigate = useNavigate();

  const {
    createLoan,
    laboratories,
    loading,
    error,
  } = useLoans();

  const [formData, setFormData] = useState({
    id_fk_laboratory: 0,
    id_in_charger: 0,
    date_start: "",
    date_end: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (
      formData.id_fk_laboratory === 0 ||
      formData.id_in_charger === 0 ||
      formData.date_start === "" ||
      formData.date_end === ""
    ) {
      setErrorMessage("Debe llenar todos los campos.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    if (new Date(formData.date_end) < new Date(formData.date_start)) {
      setErrorMessage("La fecha de fin no puede ser anterior a la fecha de inicio.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      await createLoan(formData);
      setSuccessMessage("Préstamo creado correctamente.");
      setTimeout(() => navigate("/auth/loans"), 2000);
    } catch {
      setErrorMessage("Error al crear el préstamo.");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Alert text={error} variant="alert alert-danger" iconVariant="error" />;

  return (
    <div className={styles.body}>
      <div className={styles.cont}>
        <Sidebar />
        <div className="container" style={{ marginTop: "50px" }}>
          {successMessage && (
            <Alert text={successMessage} variant="alert alert-success" iconVariant="success" />
          )}
          {errorMessage && (
            <Alert text={errorMessage} variant="alert alert-danger" iconVariant="error" />
          )}

          <h1>Crear Préstamo</h1>
          <hr style={{ border: "1px solid" }} />

          <div className="row g-3 mt-3">
            <div className="col">
              <label className="form-label"><strong>ID del Encargado</strong></label>
              <input
                type="number"
                className="form-control"
                value={formData.id_in_charger}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    id_in_charger: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col">
              <label className="form-label"><strong>Laboratorio</strong></label>
              <select
                className="form-select"
                value={formData.id_fk_laboratory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    id_fk_laboratory: Number(e.target.value),
                  }))
                }
              >
                <option value={0}>Seleccione un laboratorio</option>
                {laboratories.map((lab) => (
                  <option key={lab.id_laboratory} value={lab.id_laboratory}>
                    {lab.id_laboratory} - {lab.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col">
              <label className="form-label"><strong>Fecha de Inicio</strong></label>
              <input
                type="date"
                className="form-control"
                value={formData.date_start}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    date_start: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col">
              <label className="form-label"><strong>Fecha de Fin</strong></label>
              <input
                type="date"
                className="form-control"
                value={formData.date_end}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    date_end: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="mt-4" style={{ textAlign: "end" }}>
            <span style={{ marginRight: "20px" }}>
              <Button text="Guardar Préstamo" size="md" variant="secondary active" onClick={handleSubmit} />
            </span>
            <Button text="Cancelar" size="md" variant="danger" onClick={() => navigate("/auth/loans")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLoan;
