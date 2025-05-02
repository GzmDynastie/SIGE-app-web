import Sidebar from "../../components/Sidebar";
import Button from "../../components/Button";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import styles from "../../styles/pages/Tickets.module.css";
import { useEquipment } from "../../hooks/useEquipment";

const UpdateEquipment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchEquipmentById, updateEquipment, loading, error } = useEquipment();

  const [formData, setFormData] = useState({
    description: "",
    in_charge: 0,
    area: 0,
    registration_date: "",
    brand: "",
    model: "",
    number_serial: "",
    mac_address: "",
    connection_type: ""
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!id) return;
      try {
        const equipment = await fetchEquipmentById(Number(id));
        if (equipment) {
          setFormData({
            description: equipment.description,
            in_charge: equipment.in_charge,
            area: equipment.area,
            registration_date: equipment.registration_date,
            brand: equipment.brand,
            model: equipment.model,
            number_serial: equipment.number_serial,
            mac_address: equipment.mac_address,
            connection_type: equipment.connection_type
          });
        } else {
          setErrorMessage("Equipo no encontrado.");
        }
      } catch {
        setErrorMessage("Error al cargar el equipo.");
      }
    };
    if (id) fetchEquipment();
  }, [id]);

  const handleSubmit = async () => {
    if (
      formData.description === "" ||
      formData.in_charge === 0 ||
      formData.area === 0 ||
      formData.registration_date === "" ||
      formData.brand === "" ||
      formData.model === "" ||
      formData.number_serial === "" ||
      formData.mac_address === "" ||
      formData.connection_type === ""
    ) {
      setErrorMessage("Debe llenar todos los campos.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      // Verifica que el ID sea válido y llama a la función de actualización
      await updateEquipment(id ? Number(id) : 0, formData);
      setSuccessMessage("Equipo actualizado con éxito.");
      setTimeout(() => navigate("/auth/equipment"), 2000); // Redirige después de un tiempo
    } catch (err) {
      setErrorMessage("Error al actualizar el equipo.");
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

          <h1>Actualizar Equipo</h1>
          <hr style={{ border: "1px solid" }} />

          {/* Campos del formulario */}
          <div className="row g-3 mt-3">
            <div className="col">
              <label className="form-label"><strong>Descripción</strong></label>
              <input
                type="text"
                className="form-control"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, in_charge: Number(e.target.value) }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, area: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col">
              <label className="form-label"><strong>Fecha de Registro</strong></label>
              <input
                type="text"
                className="form-control"
                value={formData.registration_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, registration_date: e.target.value }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, number_serial: e.target.value }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, mac_address: e.target.value }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, connection_type: e.target.value }))}
              />
            </div>
          </div>

          <div className="mt-4" style={{ textAlign: "end" }}>
            <span style={{ marginRight: "20px" }}>
              <Button
                text="Guardar Cambios"
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

export default UpdateEquipment;
