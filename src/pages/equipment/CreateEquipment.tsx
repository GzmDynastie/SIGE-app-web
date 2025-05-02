import Sidebar from "../../components/Sidebar";
import Button from "../../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import styles from "../../styles/pages/Tickets.module.css";
import { useEquipment } from "../../hooks/useEquipment";

const CreateEquipment: React.FC = () => {
  const navigate = useNavigate();
  const { createEquipment, loading, error } = useEquipment();

  const [formData, setFormData] = useState({
    description: "",
    brand: "",
    model: "",
    number_serial: "",
    mac_address: "",
    connection_type: "",
    area: 0,
    in_charge: 0,
    registration_date: new Date().toISOString(), // Asignar la fecha actual
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validación para asegurarse de que todos los campos necesarios estén llenos
    if (
      formData.description === "" ||
      formData.brand === "" ||
      formData.model === "" ||
      formData.number_serial === "" ||
      formData.mac_address === "" ||
      formData.connection_type === "" ||
      formData.area === 0 ||
      formData.in_charge === 0
    ) {
      setErrorMessage("Debe llenar todos los campos.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      // Crear equipo con todos los datos
      await createEquipment(formData);
      setSuccessMessage("Equipo creado con éxito.");
      setTimeout(() => navigate("/auth/equipment"), 2000);
    } catch {
      setErrorMessage("Error al crear el equipo.");
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

          <h1>Crear Equipo</h1>
          <hr style={{ border: "1px solid" }} />

          <div className="row g-3 mt-3">
            <div className="col">
              <label className="form-label"><strong>Descripción</strong></label>
              <input
                type="text"
                className="form-control"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col">
              <label className="form-label"><strong>Marca</strong></label>
              <input
                type="text"
                className="form-control"
                value={formData.brand}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    brand: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col">
              <label className="form-label"><strong>Modelo</strong></label>
              <input
                type="text"
                className="form-control"
                value={formData.model}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    model: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col">
              <label className="form-label"><strong>Número de Serie</strong></label>
              <input
                type="text"
                className="form-control"
                value={formData.number_serial}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    number_serial: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col">
              <label className="form-label"><strong>Dirección MAC</strong></label>
              <input
                type="text"
                className="form-control"
                value={formData.mac_address}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    mac_address: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col">
              <label className="form-label"><strong>Tipo de Conexión</strong></label>
              <input
                type="text"
                className="form-control"
                value={formData.connection_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    connection_type: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col">
              <label className="form-label"><strong>Área</strong></label>
              <input
                type="number"
                className="form-control"
                value={formData.area}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    area: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col">
              <label className="form-label"><strong>Responsable</strong></label>
              <input
                type="number"
                className="form-control"
                value={formData.in_charge}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    in_charge: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="mt-4" style={{ textAlign: "end" }}>
            <span style={{ marginRight: "20px" }}>
              <Button
                text="Guardar Equipo"
                size="md"
                variant="secondary active"
                onClick={handleSubmit}
              />
            </span>
            <Button
              text="Cancelar"
              size="md"
              variant="danger"
              onClick={() => navigate("/auth/equipment")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEquipment;
