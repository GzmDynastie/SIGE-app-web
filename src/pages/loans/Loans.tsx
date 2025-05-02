import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoans } from "../../hooks/useLoans";
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
import { Loan } from "../../types/Loan";

const Loans: React.FC = () => {
  const navigate = useNavigate();
  const { loans: loanData, error: loanError, loading: loanLoading, fetchLoans } = useLoans();

  useEffect(() => {
    fetchLoans();
  }, []);

  const [showRecords] = useState<string>("50");
  const [selectedLoans, setSelectedLoans] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectPage, setSelectPage] = useState(false);
  const [alertMessage, setAlertMessage] = useState<String | null>(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage = parseInt(showRecords);

  const handleSelectPage = () => {
    if (selectPage) {
      setSelectedLoans([]);
    } else {
      const pageLoanIds = currentLoans
        .map(loan => loan.id_loan)
        .filter((id): id is number => id !== undefined);
      setSelectedLoans(pageLoanIds);
    }
    setSelectPage(!selectPage);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLoans([]);
    } else {
      const allLoanIds = loanData
        .map(loan => loan.id_loan)
        .filter((id): id is number => id !== undefined);
      setSelectedLoans(allLoanIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSelect = (loanId: number) => {
    setSelectedLoans((prevSelected) => {
      const updatedSelection = prevSelected.includes(loanId)
        ? prevSelected.filter(id => id !== loanId)
        : [...prevSelected, loanId];
      return updatedSelection;
    });
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentLoans = loanData.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Table columns
  const columns: { key: keyof (Loan & { checkbox: JSX.Element; actions: JSX.Element }); label: string | JSX.Element }[] = [
    {
      key: "checkbox", label:
        <input className="form-check-input"
          type="checkbox"
          checked={selectPage}
          onChange={handleSelectPage}
          disabled={selectAll} />
    },
    { key: "id_loan", label: "ID de Préstamo" },
    { key: "date_start", label: "Fecha de Préstamo" },
    { key: "date_end", label: "Fecha de Vencimiento" },
    { key: "id_in_charger", label: "Responsable" },
    { key: "id_fk_laboratory", label: "Laboratorio" },
    {
      key: "actions", label: "Acciones"
    }
  ];

  const createLoanArray = (loanData: Loan[]) => {
    return loanData.map(loan => ({
      id_loan: loan.id_loan,
      loan_date: loan.date_start,
      due_date: loan.date_end,
      responsible: loan.id_in_charger,
      laboratory: loan.id_fk_laboratory,
    }));
  };

  const handleExportLoans = (type: string) => {
    const loans = createLoanArray(loanData);
    if (loans.length === 0) {
      setAlertMessage("No hay préstamos para exportar");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }
    if (type === "PDF") {
      exportToPDF(loans, {
        title: "Lista de Préstamos",
        filename: "lista_prestamos.pdf",
        headers: ["ID", "Fecha de Préstamo", "Fecha de Vencimiento", "Responsable", "Laboratorio"],
        keys: ["id_loan", "loan_date", "due_date", "responsible", "laboratory"],
      });
    }
    if (type === "EXCEL") {
      exportToExcel(loans);
    }
    setAlertMessage(null);
  };

  if (loanLoading) return <Loading />;

  if (loanError) {
    const errorMessage = [loanError && `Loans -> ${loanError}`].filter(Boolean).join(" | ");
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
                <label><strong>Todos los préstamos ({loanData.length})</strong></label>
              </div>
            </div>

            <div className={styles[`button-ticketss`]}>
              <div className="btn-group" role="group">
                <button type="button" className="btn btn-outline-dark" onClick={() => handleExportLoans("EXCEL")}>Excel</button>
                <button type="button" className="btn btn-outline-dark" onClick={() => handleExportLoans("PDF")}>PDF</button>
              </div>
            </div>

            <div className={styles[`button-ticketss`]}>
              <Button text="Agregar Préstamo" variant="secondary active" size="md" onClick={() => navigate("/auth/loans/create")} />
            </div>
          </div>

          <div className={styles[`container-2`]} style={{ height: "auto" }}>
            <Table
              data={currentLoans.map(loan => ({
                ...loan,
                checkbox: (
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedLoans.includes(loan.id_loan)}
                    onChange={() => handleSelect(loan.id_loan)}
                    disabled={selectAll}
                  />
                ),
                actions: (
                  <Button
                    text={<FontAwesomeIcon icon={faEdit} />}
                    onClick={() => navigate(`/auth/loans/update/${loan.id_loan}`)}
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
            totalRecords={loanData.length}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
};

export default Loans;
