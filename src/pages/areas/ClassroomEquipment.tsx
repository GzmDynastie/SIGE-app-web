import styles from "../../styles/pages/Tickets.module.css"
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";
import Alert from "../../components/Alert";
import Pagination from "../../components/Pagination";
import { exportToPDF, exportToExcel } from "../../utils/exportUtils";
import { useEffect, useState } from "react";
import { Equipment } from "../../types/Equipment";
import { useAreas } from "../../hooks/useAreas";
import { useNavigate, useParams } from "react-router-dom";

const ClassroomEquipment: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { getEquipmentAreaById } = useAreas();

    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [selectedEquipments, setSelectedEquipments] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectPage, setSelectPage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<String | null>(null);
    const [successMessage, setsuccessMessage] = useState<String | null>(null);
    const [search, setSearch] = useState<String | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showRecords, setShowRecords] = useState<string>("50");
    const recordsPerPage = parseInt(showRecords);

    

    useEffect(() => {
        const fetchEquipment = async () => {
          if (!id) return;
          setLoading(true);
          try {
            const equipmentData = await getEquipmentAreaById(parseInt(id));
            if (!equipmentData) {
              setErrorMessage("El o los equipos no fueron encontrados");
            //   setTimeout(() => navigate("/auth/area"), 1500);
              return;
            }
            setEquipments(equipmentData);
          } catch (error) {
            console.log("Error al obtener el área:", error);
            console.log(loading, errorMessage, setsuccessMessage, setSearch, setShowRecords); //Chk
            setErrorMessage(`Error al obtener el área: ${error}`);
            setTimeout(() => navigate("/auth/area"), 1500);
          } finally {
            setLoading(false);
          }
        };
      
        fetchEquipment();
      }, [id]);

    const filteredEquipments = equipments.filter(equipment => {
        return (
            (search === "" || equipment.description || equipment.in_charge)
        )
    });

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentEquipments = (filteredEquipments).slice(indexOfFirstRecord, indexOfLastRecord);

    const handleSelectPage = () => {
        if (selectPage) {
            setSelectedEquipments([]);
        } else {
            const pageTicketIds = currentEquipments.map(equipment => equipment.id_state);
            setSelectedEquipments(pageTicketIds);
        }
        setSelectPage(!selectPage);
    }

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedEquipments([]);
        } else {
            const allTicketIds = filteredEquipments.map(equipment => equipment.id_state);
            setSelectedEquipments(allTicketIds);
        }
        setSelectAll(!selectAll);
    };

    const createEquipmentArray = (equipment: Equipment[]) => {
        return equipment.map(equip => ({
            id_state: equip.id_state,
            full_name: equip.full_name,
            description: equip.description,
            brand: equip.brand,
            model: equip.model,
            number_serial: equip.number_serial,
        }));
    };

    const handleSelectTicket = (equipmentId: number) => {
        setSelectedEquipments((prevSelected) => {
            const updatedSelection = prevSelected.includes(equipmentId)
                ? prevSelected.filter(id => id !== equipmentId)
                : [...prevSelected, equipmentId];
            return updatedSelection;
        });
    };

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Table columns
    const columns: {
        key: keyof (Equipment & { checkbox: JSX.Element });
        label: string | JSX.Element
    }[] = [
            {
                key: "checkbox",
                label:
                    <div>
                        <input className="form-check-input"
                            type="checkbox" id="checkboxNoLabel"
                            checked={selectPage}
                            onChange={handleSelectPage}
                            disabled={selectAll} />
                    </div>
            },
            { key: "id_state", label: "ID" },
            { key: "full_name", label: "Resguardante" },
            { key: "description", label: "Tipo de equipo" },
            { key: "brand", label: "Marca" },
            { key: "model", label: "Modelo" },
            { key: "number_serial", label: "Numero de Serie" }
        ];

    const handleExportEquipments = (type: string) => {
        const equipment = createEquipmentArray(equipments);
        if (equipment.length === 0) {
            setErrorMessage("No hay equipos para exportar");
            setTimeout(() => setErrorMessage(null), 3000);
            return;
        }
        if (type === "PDF") {
            exportToPDF(equipment, {
                title: "Reporte de Equipos",
                filename: "reporte_equipos.pdf",
                headers: ["ID", "Resguardante", "Tipo de Equipo", "Marca", "Modelo", "Numero de Serie"],
                keys: ["id_state", "full_name", "description", "brand", "model", "number_serial"]
            });
        }
        if (type === "EXCEL") {
            exportToExcel(equipment);
        }
        setErrorMessage(null);
    }

    return (
        <div className={styles.body}>
            <div className={styles.cont}>
                <Sidebar />
                <div className="container-plus">
                    {/* {errorMessage && <Alert text={String(errorMessage)} iconVariant="error" variant="alert alert-danger" />} */}
                    {successMessage && <Alert text={String(successMessage)} iconVariant="error" variant="alert alert-danger" />}

                    <div className={styles[`container-2`]}>
                        <div className={styles[`button-ticket`]}>
                            <div>
                                <input
                                    className="form-check-input"
                                    type="checkbox" id="checkboxNoLabel-2"
                                    style={{ fontSize: "25px", marginRight: "10px", marginTop: "-4px" }}
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    disabled={selectPage}
                                />
                                <label htmlFor=""><strong>Todos los equipos ({equipments.length})</strong></label>
                            </div>
                        </div>

                        <div className={styles[`button-ticketss`]} >
                            <div className="btn-group" role="group" aria-label="Basic outlined example">
                                <button type="button" className="btn btn-outline-dark" onClick={() => handleExportEquipments("EXCEL")}>Excel</button>
                                <button type="button" className="btn btn-outline-dark" onClick={() => handleExportEquipments("PDF")}>PDF</button>
                            </div>
                        </div>

                        <div className={styles[`button-ticketss`]}>
                            <div className="mb-3">
                                <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder="Buscar" />
                            </div>
                        </div>
                    </div>

                    <div className={styles[`container-2`]} style={{ height: "auto" }}>
                        <Table
                            data={currentEquipments.map(equipment => ({
                                ...equipment,
                                checkbox: (
                                    <div>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={selectedEquipments.includes(equipment.id_state)}
                                            onChange={() => handleSelectTicket(equipment.id_state)}
                                            disabled={selectAll} />
                                    </div>
                                )
                            }))}
                            columns={columns}
                        />
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        recorsPerPage={recordsPerPage}
                        totalRecords={(filteredEquipments).length}
                        paginate={paginate}
                    />
                </div>
            </div >
        </div>
    );
}

export default ClassroomEquipment;