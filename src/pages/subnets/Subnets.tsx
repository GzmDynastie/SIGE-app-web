import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSubnets } from "../../hooks/useSubnets";
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
import { Subnet } from "../../types/Subnet";


const Subnets: React.FC = () => {
    const navigate = useNavigate();
    const { subnets: subnetData, error: subnetError, loading: subnetLoading, getAllSubnets } = useSubnets();


    useEffect(() => {
        getAllSubnets();
    }, [])

    
    const [showRecords] = useState<string>("50");
    const [selectedSubnets, setSelectedSubnets] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectPage, setSelectPage] = useState(false);
    const [alertMessage, setAlertMessage] = useState<String | null>(null);

    // State for pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage = parseInt(showRecords);

    const handleSelectPage = () => {
        if (selectPage) {
            setSelectedSubnets([]);
        } else {
            const pageSubnetIds = currentSubnets.map(subnet => subnet.id);
            setSelectedSubnets(pageSubnetIds);
        }
        setSelectPage(!selectPage);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedSubnets([]);
        } else {
            const allSubnetIds = subnetData.map(subnet => subnet.id);
            setSelectedSubnets(allSubnetIds);
        }
        setSelectAll(!selectAll);
    };


    const handleSelect = (subnetId: number) => {
        setSelectedSubnets((prevSelected) => {
            const updatedSelection = prevSelected.includes(subnetId)
                ? prevSelected.filter(id => id !== subnetId)
                : [...prevSelected, subnetId];
            return updatedSelection;
        });
    };

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentSubnets = subnetData.slice(indexOfFirstRecord, indexOfLastRecord);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Table columns
    const columns: { key: keyof (Subnet & { checkbox: JSX.Element; actions: JSX.Element }); label: string | JSX.Element }[] = [
        {
            key: "checkbox", label:
                <input className="form-check-input"
                    type="checkbox"
                    checked={selectPage}
                    onChange={handleSelectPage}
                    disabled={selectAll} />
        },
        { key: "vlan", label: "VLAN" },
        { key: "initial_range", label: "Rango Inicial" },
        { key: "end_range", label: "Rango Final" },
        { key: "getway", label: "Gateway" },
        { key: "description", label: "Descripción" },
        { key: "number_of_ips", label: "IPs" },
        { key: "actions", label: "Acciones" },
    ];

    const createSubnetArray = (subnetData: Subnet[]) => {
        return subnetData.map(subnet => ({
            vlan: subnet.vlan,
            initial_range: subnet.initial_range,
            end_range: subnet.end_range,
            getway: subnet.getway,
            description: subnet.description,
            number_of_ips: subnet.number_of_ips,
        }));
    };

    
    const handleExportSubnets = (type: string) => {
        const subnets = createSubnetArray(subnetData);
        if (subnets.length === 0) {
            setAlertMessage("No hay subredes para exportar");
            setTimeout(() => setAlertMessage(null), 3000);
            return;
        }
        if (type === "PDF") {
            exportToPDF(subnets, {
                title: "Lista de Subredes",
                filename: "lista_subredes.pdf",
                headers: ["VLAN", "Rango Inicial", "Rango Final", "Gateway", "Descripción", "IPs"],
                keys: ["vlan", "initial_range", "end_range", "getway", "description", "number_of_ips"]
            });
        }
        if (type === "EXCEL") {
            exportToExcel(subnets);
        }
        setAlertMessage(null);
    };

    if (subnetLoading) return <Loading />;

    if (subnetError) {
        const errorMessage = [subnetError && `Subnets -> ${subnetError}`].filter(Boolean).join(" | ");
        return <Alert text={`Error: ${errorMessage}`} variant="alert alert-danger" iconVariant="error" />;
    }

    return (
        <div className={styles.body}>
            <div className={styles.cont}>
                <Sidebar />
                <div className="container-plus">
                    <div className={styles[`container-2`]}> {alertMessage && <Alert text={String(alertMessage)} iconVariant="error" variant="alert alert-danger" />} </div>

                    <div className={styles[`container-2`]}> 
                        <div className={styles[`button-ticket`]}> 
                            <div>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    style={{ fontSize: "25px", marginRight: "10px", marginTop: "-4px" }}
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    disabled={selectPage}
                                />
                                <label><strong>Todas las subredes ({subnetData.length})</strong></label>
                            </div>
                        </div>

                        <div className={styles[`button-ticketss`]}>
                            <div className="btn-group" role="group">
                                <button type="button" className="btn btn-outline-dark" onClick={() => handleExportSubnets("EXCEL")}>Excel</button>
                                <button type="button" className="btn btn-outline-dark" onClick={() => handleExportSubnets("PDF")}>PDF</button>
                            </div>
                        </div>

                        <div className={styles[`button-ticketss`]}>
                            <Button text="Agregar Subred" variant="secondary active" size="md" onClick={() => navigate("/auth/subnets/create")} />
                        </div>
                    </div>

                    <div className={styles[`container-2`]} style={{ height: "auto" }}>
                        <Table
                            data={currentSubnets.map(subnet => ({
                                ...subnet,
                                checkbox: (
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={selectedSubnets.includes(subnet.id)}
                                        onChange={() => handleSelect(subnet.id)}
                                        disabled={selectAll}
                                    />
                                ),
                                actions: (
                                    <Button
                                        text={<FontAwesomeIcon icon={faEdit} />}
                                        onClick={() => navigate(`/auth/subnet/update/${subnet.id}`)}
                                        variant="success"
                                        size="md"
                                        title="Actualizar"
                                    />
                                ),
                            }))}
                            columns={columns}
                        />
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        recorsPerPage={recordsPerPage}
                        totalRecords={subnetData.length}
                        paginate={paginate}
                    />
                </div>
            </div>
        </div>
    );
};

export default Subnets;
