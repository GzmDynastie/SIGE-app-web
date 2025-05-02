import styles from "../styles/components/NotFound.module.css";

const NotFound: React.FC = () => {
  return (
    <div className={styles["not-found-container"]}>
      <div className={styles["error-image"]}></div>
      <h1 className={styles["error-text"]}>¡Vaya! Página no encontrada</h1>
      <p className={styles["error-code"]}>Error 404</p>
      <button className={styles["back-button"]} onClick={() => window.history.back()}>
        Regresar
      </button>
    </div>
  );
};

export default NotFound;
