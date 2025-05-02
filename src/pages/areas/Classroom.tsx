import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button as Btn } from "react-bootstrap";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";
import Sidebar from "../../components/Sidebar";
import styles from "../../styles/pages/Classroom.module.css"
import { Area } from "../../types/Area";
import { useAreas } from "../../hooks/useAreas";
import { Laptop, Tv, Projector, Webcam, Speaker, Presentation } from "lucide-react";

const Classroom: React.FC = () => {
    const navigate = useNavigate();
    const { areas: areaData, error: areaError, loading: areaLoading, getAllAreas } = useAreas();

    const [showModal, setShowModal] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState<Area | null>(null);

    useEffect(() => {
        getAllAreas();
    }, [])

    const uniqueFloors = Array.from(
        new Map(areaData.map((area) => [area.floor, area])).keys()
    ).sort();

    const handleClassroom = (area: Area) => {
        setSelectedClassroom(area);
        setShowModal(true);
    }

    if (areaLoading) return <Loading />

    if (areaError) {
        return <Alert text={`Error: Areas -> ${areaError}`} variant="alert alert-danger" iconVariant="error" />;
    }

    return (
        <div className={styles.body}>
            <div className={styles.container_master}>
                <div>
                    <Sidebar />
                </div>
                <div className="container">
                    <br />
                    <h1>Sede Centro</h1>
                    <hr className={styles.hr_classroom} />

                    <div className={styles.card}>
                        <h2>Edificio 1</h2>
                        <hr className={styles.hr_classroom} />

                        <div className="container" id={styles.container_button}>
                            {uniqueFloors.map((floor, index) => {
                                const classrooms = areaData
                                    .filter((area) => area.floor === floor)
                                    .sort((a, b) => Number(a.classroom) - Number(b.classroom))
                                    .map((area, idx) => {
                                        const icons = [];

                                        if (area.equipment.includes("Pantalla")) icons.push(<Tv key="pantalla" />);
                                        if (area.equipment.includes("PC")) icons.push(<Laptop key="computadora" />);
                                        if (area.equipment.includes("Proyector")) icons.push(<Projector key="proyector" />);
                                        if (area.equipment.includes("Camara")) icons.push(<Webcam key="camara" />);
                                        if (area.equipment.includes("Bocinas")) icons.push(<Speaker key="bocinas" />);
                                        if (area.equipment.includes("Pantalla Proyección")) icons.push(<Presentation key="pantalla p" />);

                                        return (
                                            <Button key={idx} text={`${area.type_space}: ${area.classroom}`} icon={icons} onClick={() => handleClassroom(area)} />
                                        );
                                    });

                                return (
                                    <div key={index}>
                                        <h3>{floor}</h3>
                                        {classrooms}
                                        <hr className={styles.hr_clasroom} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Modal */}
                <Modal show={showModal} onHide={() => setShowModal(true)} dialogClassName={styles.custom_modal_classroom} centered>
                    <Modal.Header closeButton onClick={() => setShowModal(false)}>
                        <Modal.Title>{`${selectedClassroom?.floor} // ${selectedClassroom?.type_space}: ${selectedClassroom?.classroom} // Coordinación: ${selectedClassroom?.coordination} // División: ${selectedClassroom?.division}`}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={styles.custom_img}>
                            {selectedClassroom?.image?.map((image, index) => (
                                <div key={index}>
                                    <img
                                        src={typeof image === "string" ? image : URL.createObjectURL(image)}
                                        alt={`Previsualización ${index + 1}`}
                                        style={{
                                            width: "670px",
                                            height: "auto",
                                            marginLeft: "10px"
                                        }}
                                        className="img-thumbnail"
                                    />
                                </div>
                            ))}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            text="Equipos"
                            variant="primary"
                            onClick={() => navigate(`/auth/classroom/equipment/${selectedClassroom?.id_area}`)} />
                        <Btn variant="secondary" onClick={() => setShowModal(false)}>
                            Cerrar
                        </Btn>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Classroom;