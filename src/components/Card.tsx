import styles from "../styles/components/Card.module.css";

interface CardProps {
    image?: string;
    text?: string;
    children?: React.ReactNode;
    nameImage?: string;
}

const Card: React.FC<CardProps> = ({ text, children }) => {
    return (

        <div className={styles.card}>
            <h4>{text}</h4>
            
            <div className={styles.cardBody}>
            <hr style={{marginTop: "2px"}}/>
                <div className={styles.cardActions}>{children}</div>
            </div>
        </div>
    );
};

export default Card;
