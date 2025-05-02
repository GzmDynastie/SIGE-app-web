import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAreas } from "../../hooks/useAreas";
import { exportToPDF, exportToExcel } from "../../utils/exportUtils";
import Sidebar from "../../components/Sidebar";
import Button from '../../components/Button';
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/pages/Tickets.module.css"
import { Area } from "../../types/Area";

const Areas: React.FC = () => {
    const navigate = useNavigate();
    const { areas: areaData, error: areaError, loading: areaLoading, getAllAreas } = useAreas();

    useEffect(() => {
        getAllAreas();
    }, [])

    // State for filters
    const [showRecords] = useState<string>("50");
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectPage, setSelectPage] = useState(false);
    const [alertMessage, setAlertMessage] = useState<String | null>(null);

    // State for pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage = parseInt(showRecords);

    const handleSelectPage = () => {
        if (selectPage) {
            setSelectedAreas([]);
        } else {
            const pageAreaIds = currentAreas.map(area => area.id_area);
            setSelectedAreas(pageAreaIds);
        }
        setSelectPage(!selectPage);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedAreas([]);
        } else {
            const allAreaIds = areaData.map(area => area.id_area);
            setSelectedAreas(allAreaIds);
        }
        setSelectAll(!selectAll);
    };

    const handleSelectArea = (areaId: number) => {
        setSelectedAreas((prevSelected) => {
            const updatedSelection = prevSelected.includes(areaId)
                ? prevSelected.filter(id => id !== areaId)
                : [...prevSelected, areaId];
            return updatedSelection;
        });
    };

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentAreas = areaData.slice(indexOfFirstRecord, indexOfLastRecord);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Table columns
    const columns: { key: keyof (Area & { checkbox: JSX.Element, area: string; actions: JSX.Element }); label: string | JSX.Element }[] = [
        {
            key: "checkbox", label:
                <div>
                    <input className="form-check-input"
                        type="checkbox" id="checkboxNoLabel"
                        checked={selectPage}
                        onChange={handleSelectPage}
                        disabled={selectAll} />
                </div>
        },
        { key: "type_space", label: "Tipo de espacio" },
        { key: "sede", label: "Sede" },
        { key: "building", label: "Edificio" },
        { key: "floor", label: "Piso" },
        { key: "division", label: "Division" },
        { key: "coordination", label: "Coordinacion" },
        { key: "area", label: "Area" },
        { key: "actions", label: "Acciones" },
    ];

    const createAreaArray = (areaData: Area[]) => {
        return areaData.map(area => ({
            type_space: area.type_space,
            sede: area.sede,
            building: area.building,
            floor: area.floor,
            division: area.division,
            coordination: area.coordination,
            area: `${area.sede} - ${area.division} - ${area.building} - ${area.floor} - ${area.classroom}`,
        }));
    };
    
    const handleExportAreas = (type: string) => {
        const areas = createAreaArray(areaData);
        if (areas.length === 0) {
            setAlertMessage("No hay areas para exportar");
            setTimeout(() => setAlertMessage(null), 3000);
            return;
        }
        if (type === "PDF") {
            exportToPDF(areas, {
                title: "Lista de Areas",
                filename: "lista_areas.pdf",
                headers: ["Tipo de espacio", "Sede", "Edificio", "Piso", "Division", "Coordinacion", "Area"],
                keys: ["type_space", "sede", "building", "floor", "division", "coordination", "area"]
            });
        }
        if (type === "EXCEL") {
            exportToExcel(areas);
        }
        setAlertMessage(null);
    }

    if (areaLoading) return <Loading />;

    if (areaError) {
        const errorMessage = [areaError && `Tickets -> ${areaError}`]
            .filter(Boolean)
            .join(" | ");

        return <Alert text={`Error: ${errorMessage}`} variant="alert alert-danger" iconVariant="error" />;
    }

    return (
        <div className={styles.body}>
            <div className={styles.cont}>
                <Sidebar />
                <div className="container-plus">
                    <div className={styles[`container-2`]}>
                        {alertMessage && <Alert text={String(alertMessage)} iconVariant="error" variant="alert alert-danger" />}
                    </div>

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
                                <label htmlFor=""><strong>Todas las areas ({areaData.length})</strong></label>
                            </div>
                        </div>

                        <div className={styles[`button-ticketss`]} >
                            <div className="btn-group" role="group" aria-label="Basic outlined example">
                                <button type="button" className="btn btn-outline-dark" onClick={() => handleExportAreas("EXCEL")}>Excel</button>
                                <button type="button" className="btn btn-outline-dark" onClick={() => handleExportAreas("PDF")}>PDF</button>
                            </div>
                        </div>

                        <div className={styles[`button-ticketss`]}>
                            <div className="">
                                <Button text="Agregar Area" variant="secondary active" size="md" onClick={() => navigate("/auth/area/create")} />
                            </div>
                        </div>

                    </div>

                    <div className={styles[`container-2`]} style={{ height: "auto" }}>
                        <Table
                            data={currentAreas.map(area => ({
                                ...area,
                                checkbox: (
                                    <div>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={selectedAreas.includes(area.id_area)}
                                            onChange={() => handleSelectArea(area.id_area)}
                                            disabled={selectAll} />
                                    </div>
                                ),
                                area: (
                                    <span>
                                        <strong>{area.sede}</strong> - {area.division} - {area.building} - {area.floor} - {area.classroom}
                                    </span>
                                ),
                                actions: (
                                    <div className="d-flex gap-2">
                                        <Button
                                            text={<FontAwesomeIcon icon={faEdit} />}
                                            onClick={() => navigate(`/auth/area/update/${area.id_area}`)}
                                            variant="success"
                                            size="md"
                                            key={area.id_area}
                                            title="Actualizar"
                                        />
                                    </div>
                                ),
                            }))}
                            columns={columns}
                        />
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        recorsPerPage={recordsPerPage}
                        totalRecords={(areaData).length}
                        paginate={paginate}
                    />
                </div>
            </div >
        </div>

    );
};

export default Areas;