import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useEquipment } from "../../hooks/useEquipment";
import { exportToPDF, exportToExcel } from "../../utils/exportUtils";
import Sidebar from "../../components/Sidebar";
import Button from '../../components/Button';
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/pages/Tickets.module.css";
import { Equipment } from "../../types/Equipment";

const EquipmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { equipment: equipmentData, error: equipmentError, loading: equipmentLoading, fetchEquipment } = useEquipment();

  useEffect(() => {
    fetchEquipment();
  }, []);

  const [showRecords] = useState<string>("50");
  const [selectedEquipment, setSelectedEquipment] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectPage, setSelectPage] = useState(false);
  const [alertMessage, setAlertMessage] = useState<String | null>(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage = parseInt(showRecords);

  const handleSelectPage = () => {
    if (selectPage) {
      setSelectedEquipment([]);
    } else {
      const pageEquipmentIds = currentEquipment
        .map(equipment => equipment.id_state)
        .filter((id): id is number => id !== undefined);
      setSelectedEquipment(pageEquipmentIds);
    }
    setSelectPage(!selectPage);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEquipment([]);
    } else {
      const allEquipmentIds = equipmentData
        .map(equipment => equipment.id_state)
        .filter((id): id is number => id !== undefined);
      setSelectedEquipment(allEquipmentIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSelect = (equipmentId: number) => {
    setSelectedEquipment((prevSelected) => {
      const updatedSelection = prevSelected.includes(equipmentId)
        ? prevSelected.filter(id => id !== equipmentId)
        : [...prevSelected, equipmentId];
      return updatedSelection;
    });
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentEquipment = equipmentData.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Table columns (without ubication)
  const columns: { key: keyof (Equipment & { checkbox: JSX.Element; actions: JSX.Element }); label: string | JSX.Element }[] = [
    {
      key: "checkbox", label:
        <input className="form-check-input"
          type="checkbox"
          checked={selectPage}
          onChange={handleSelectPage}
          disabled={selectAll} />
    },
    { key: "id_state", label: "ID de Equipo" },
    { key: "area", label: "Área" },
    { key: "description", label: "Descripción" },
    { key: "registration_date", label: "Fecha de Registro" },
    {
      key: "actions", label: "Acciones"
    }
  ];

  const createEquipmentArray = (equipmentData: Equipment[]) => {
    return equipmentData.map(equipment => ({
      id_state: equipment.id_state,
      area: equipment.area,
      description: equipment.description,
      registration_date: equipment.registration_date,
    }));
  };

  const handleExportEquipment = (type: string) => {
    const equipment = createEquipmentArray(equipmentData);
    if (equipment.length === 0) {
      setAlertMessage("No hay equipos para exportar");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }
    if (type === "PDF") {
      exportToPDF(equipment, {
        title: "Lista de Equipos",
        filename: "lista_equipos.pdf",
        headers: ["ID", "Área", "Descripción", "Fecha de Registro"],
        keys: ["id_state", "area", "description", "registration_date"],
      });
    }
    if (type === "EXCEL") {
      exportToExcel(equipment);
    }
    setAlertMessage(null);
  };

  if (equipmentLoading) return <Loading />;

  if (equipmentError) {
    const errorMessage = [equipmentError && `Equipment -> ${equipmentError}`].filter(Boolean).join(" | ");
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
                <label><strong>Todos los equipos ({equipmentData.length})</strong></label>
              </div>
            </div>

            <div className={styles[`button-ticketss`]}>
              <div className="btn-group" role="group">
                <button type="button" className="btn btn-outline-dark" onClick={() => handleExportEquipment("EXCEL")}>Excel</button>
                <button type="button" className="btn btn-outline-dark" onClick={() => handleExportEquipment("PDF")}>PDF</button>
              </div>
            </div>

            <div className={styles[`button-ticketss`]}>
              <Button text="Agregar Equipo" variant="secondary active" size="md" onClick={() => navigate("/auth/equipment/create")} />
            </div>
          </div>

          <div className={styles[`container-2`]} style={{ height: "auto" }}>
            <Table
              data={currentEquipment.map(equipment => ({
                ...equipment,
                checkbox: (
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedEquipment.includes(equipment.id_state)}
                    onChange={() => handleSelect(equipment.id_state)}
                    disabled={selectAll}
                  />
                ),
                actions: (
                  <Button
                    text={<FontAwesomeIcon icon={faEdit} />}
                    onClick={() => navigate(`/auth/equipment/update/${equipment.id_state}`)}
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
            totalRecords={equipmentData.length}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
};

export default EquipmentPage;
