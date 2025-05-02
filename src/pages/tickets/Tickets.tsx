import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTickets } from "../../hooks/useTickets";
import { useUser } from "../../hooks/useUser";
import { exportToPDF, exportToExcel } from "../../utils/exportUtils";
import { Ticket, Priority, Status } from "../../types/Ticket";
import { User, } from "../../types/User";
import Sidebar from "../../components/Sidebar";
import Button from '../../components/Button';
import Table from "../../components/Table";
import Select from "../../components/Select";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/pages/Tickets.module.css"

const Tickets: React.FC = () => {
    const navigate = useNavigate();

    const { tickets: ticketData, error: ticketError, loading: ticketLoading, getAllTickets } = useTickets();
    const { users: userData, error: userError, loading: userLoading, getAllUsers } = useUser();

    useEffect(() => {
        getAllUsers();
        getAllTickets();
    }, [])

    // State for filters
    const [selectedTechnical, setSelectedTechnical] = useState<number | undefined>(undefined);
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [selectedPriority, setSelectedPriority] = useState<string>("");
    const [showRecords, setShowRecords] = useState<string>("50");
    const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectPage, setSelectPage] = useState(false);
    const [alertMessage, setAlertMessage] = useState<String | null>(null);

    // State for pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage = parseInt(showRecords);

    const statusOptions: string[] = Object.values(Status);
    const priorityOptions: string[] = Object.values(Priority);

    const handleSelectPage = () => {
        if (selectPage) {
            setSelectedTickets([]);
        } else {
            const pageTicketIds = currentTickets.map(ticket => ticket.id_ticket);
            setSelectedTickets(pageTicketIds);
        }
        setSelectPage(!selectPage);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedTickets([]);
        } else {
            const allTicketIds = filteredTickets.map(ticket => ticket.id_ticket);
            setSelectedTickets(allTicketIds);
        }
        setSelectAll(!selectAll);
    };


    const handleSelectTicket = (ticketId: number) => {
        setSelectedTickets((prevSelected) => {
            const updatedSelection = prevSelected.includes(ticketId)
                ? prevSelected.filter(id => id !== ticketId)
                : [...prevSelected, ticketId];
            return updatedSelection;
        });
    };

    const filteredTickets = ticketData.filter(ticket => {
        return (
            (selectedTechnical === undefined || ticket.id_technical === selectedTechnical) &&
            (selectedStatus === "" || ticket.status === selectedStatus) &&
            (selectedPriority === "" || ticket.priority === selectedPriority)
        )
    });

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentTickets = (filteredTickets ?? []).slice(indexOfFirstRecord, indexOfLastRecord);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Table columns
    const columns: {
        key: keyof (Ticket & { checkbox: JSX.Element, area: string; technical: string; actions: JSX.Element });
        label: string | JSX.Element
    }[] = [
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
            { key: "folio", label: "Folio" },
            { key: "creation_date", label: "Fecha Reporte" },
            { key: "area", label: "Área" },
            { key: "applicant", label: "Solicitante" },
            { key: "communication", label: "Contacto" },
            { key: "technical", label: "Técnico" },
            { key: "category", label: "Categoría" },
            { key: "priority", label: "Prioridad" },
            { key: "report", label: "Reporte" },
            { key: "actions", label: "Acciones" },
        ];

    const createTicketArray = (ticketData: Ticket[]) => {
        return ticketData.map(ticket => ({
            folio: ticket.folio,
            creation_date: ticket.sede,
            area: `${ticket.sede} - ${ticket.division} - ${ticket.building} - ${ticket.floor_} - ${ticket.classroom}`,
            applicant: ticket.applicant,
            communication: ticket.communication,
            technical: `${ticket.name_technical} ${ticket.last_name_technical}`,
            category: ticket.category,
            priority: ticket.priority,
            report: ticket.report,
        }));
    };

    const handleExportTickets = (type: string) => {
        const tickets = createTicketArray(ticketData);
        if (tickets.length === 0) {
            setAlertMessage("No hay tickets para exportar");
            setTimeout(() => setAlertMessage(null), 3000);
            return;
        }
        if (type === "PDF") {
            exportToPDF(tickets, {
                title: "Reporte de Tickets",
                filename: "reporte_tickets.pdf",
                headers: ["Folio", "Fecha Reporte", "Área", "Solicitante", "Contacto", "Técnico", "Categoría", "Prioridad", "Reporte"],
                keys: ["folio", "creation_date", "area", "applicant", "communication", "technical", "category", "priority", "report"]
            });
        }
        if (type === "EXCEL") {
            exportToExcel(tickets);
        }
        setAlertMessage(null);
    }

    if (ticketLoading || userLoading) return <Loading />;

    if (ticketError || userError) {
        const errorMessage = [ticketError && `Tickets -> ${ticketError}`, userError && `Users -> ${userError}`]
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
                        <div className={styles[`container-3`]}>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label"><strong>Seleccionar Tecnico</strong></label>
                                <Select<User>
                                    data={userData}
                                    option={{ key: "id_user", label: (user) => `${user.name} ${user.last_name}` }}
                                    value={selectedTechnical?.toString() || ""}
                                    onChange={(selectedUser: User) => { setSelectedTechnical(selectedUser.id_user); }}
                                />
                            </div>
                        </div>

                        <div className={styles[`container-3`]}>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label"><strong>Estatus</strong></label>
                                <Select
                                    data={statusOptions.map((item) => ({ value: item, label: item }))}
                                    option={{ key: "value", label: "label" }}
                                    onChange={(selected) => setSelectedStatus(selected.value)}
                                />
                            </div>
                        </div>

                        <div className={styles[`container-3`]}>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label"><strong>Prioridad</strong></label>
                                <Select
                                    data={priorityOptions.map((item) => ({ value: item, label: item }))}
                                    option={{ key: "value", label: "label" }}
                                    onChange={(selected) => setSelectedPriority(selected.value)}
                                />
                            </div>
                        </div>

                        <div className={styles[`buttons-ticket`]}>
                            <div className={styles[`container-3`]}>
                                <Button text="Crear ticket" variant="secondary active" size="md" onClick={() => navigate("/auth/ticket/create")} />
                            </div>
                        </div>

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
                                <label htmlFor=""><strong>Todos los tickets ({ticketData.length})</strong></label>
                            </div>
                        </div>

                        <div className={styles[`button-ticketss`]} >
                            <div className="btn-group" role="group" aria-label="Basic outlined example">
                                <button type="button" className="btn btn-outline-dark" onClick={() => handleExportTickets("EXCEL")}>Excel</button>
                                <button type="button" className="btn btn-outline-dark" onClick={() => handleExportTickets("PDF")}>PDF</button>
                            </div>
                        </div>

                        <div className={styles[`button-ticketss`]}>
                            <div className="">
                                <Button
                                    text="Quitar filtros"
                                    variant="btn btn-outline-success"
                                    size="md"
                                    onClick={() => {
                                        setSelectedTechnical(undefined);
                                        setSelectedStatus("");
                                        setSelectedPriority("");
                                        setShowRecords("50");
                                        setSelectedTickets([]);
                                        setSelectAll(false);
                                        setSelectPage(false);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles[`container-2`]} style={{ height: "auto" }}>
                        <Table
                            data={currentTickets.map(ticket => ({
                                ...ticket,
                                checkbox: (
                                    <div>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={selectedTickets.includes(ticket.id_ticket)}
                                            onChange={() => handleSelectTicket(ticket.id_ticket)}
                                            disabled={selectAll} />
                                    </div>
                                ),
                                area: (
                                    <span>
                                        <strong>{ticket.sede}</strong> - {ticket.division} - {ticket.building} - {ticket.floor_} - {ticket.classroom}
                                    </span>
                                ),
                                technical: (
                                    <span>
                                        {ticket.name_technical} {ticket.last_name_technical}
                                    </span>
                                ),
                                actions: (
                                    <div className="d-flex gap-2">
                                        <Button
                                            text={<FontAwesomeIcon icon={faEdit} />}
                                            onClick={() => navigate(`/auth/ticket/update/${ticket.id_ticket}`)}
                                            variant="success"
                                            size="md"
                                            key={ticket.id_ticket}
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
                        totalRecords={(filteredTickets).length}
                        paginate={paginate}
                    />
                </div>
            </div >
        </div>
    );
};

export default Tickets;