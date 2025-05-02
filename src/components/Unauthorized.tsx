import { useNavigate } from "react-router-dom";  // Importar useNavigate
import styles from "../styles/components/Unauthorized.module.css";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className={styles["unauthorized-container"]}>
      <div className={styles["error-image"]}></div>
      <h1 className={styles["error-text"]}>Acceso Denegado</h1>
      <p className={styles["error-code"]}>Error 401</p>
      <p className={styles["error-message"]}>No tienes permiso para acceder a esta página.</p>
      <button className={styles["back-button"]} onClick={handleBack}>
        Regresar
      </button>
    </div>
  );
};

export default Unauthorized;
