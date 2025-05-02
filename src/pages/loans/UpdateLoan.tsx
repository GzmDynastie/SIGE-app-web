import Sidebar from "../../components/Sidebar";
import Button from "../../components/Button";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import styles from "../../styles/pages/Tickets.module.css";
import { useLoans } from "../../hooks/useLoans";
import { Loan } from "../../types/Loan";

const UpdateLoan: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Tomamos el ID del préstamo de la URL
  const navigate = useNavigate();
  const { getLoanById, updateLoan, laboratories, loading, error } = useLoans();

  const [formData, setFormData] = useState<Loan>({
    id_loan: 0,
    id_fk_laboratory: 0,
    id_in_charger: 0,
    date_start: "",
    date_end: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loanLoaded, setLoanLoaded] = useState(false); // Para asegurarnos de que no se haga la consulta varias veces

  // Cargar los datos del préstamo cuando se monta el componente
  useEffect(() => {
    const fetchLoan = async () => {
      if (!id || loanLoaded) return; // Asegúrate de que no se vuelva a cargar si ya se ha hecho

      try {
        const loanId = Number(id); // Convertir el ID a número
        if (isNaN(loanId)) {
          setErrorMessage("ID del préstamo no válido.");
          return;
        }

        const loan = await getLoanById(loanId); // Llamada para obtener el préstamo
        if (loan) {
          setFormData({
            id_loan: loan.id_loan,
            id_fk_laboratory: loan.id_fk_laboratory,
            id_in_charger: loan.id_in_charger,
            date_start: loan.date_start,
            date_end: loan.date_end,
          });
          setLoanLoaded(true); // Marcar como cargado
        } else {
          setErrorMessage("Préstamo no encontrado.");
        }
      } catch {
        setErrorMessage("Error al cargar el préstamo.");
      }
    };

    fetchLoan();
  }, [id, loanLoaded, getLoanById]); // Solo dependemos de `id` y `getLoanById`

  const handleSubmit = async () => {
    if (
      formData.id_fk_laboratory === 0 ||
      formData.id_in_charger === 0 ||
      formData.date_start === "" ||
      formData.date_end === "" ||
      !id // Verificamos que el ID esté presente
    ) {
      setErrorMessage("Debe llenar todos los campos.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      await updateLoan(Number(id), formData); // Usamos el ID directamente desde la URL
      setSuccessMessage("Préstamo actualizado con éxito.");
      setTimeout(() => navigate("/auth/loans"), 2000);
    } catch {
      setErrorMessage("Error al actualizar el préstamo.");
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

          <h1>Actualizar Préstamo</h1>
          <hr style={{ border: "1px solid" }} />

          <div className="row g-3 mt-3">
            <div className="col">
              <label className="form-label"><strong>Encargado</strong></label>
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
              onClick={() => navigate("/auth/loans")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateLoan;
