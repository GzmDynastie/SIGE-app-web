import styles from "../styles/components/Loading.module.css";

const Test: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <img src="/images/sige_02.png" alt="Cargando" className={styles.image} />
        Cargando...
      </h2>
    </div>
  );
};

export default Test;

