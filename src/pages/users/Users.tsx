import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser"; // 👈 Hook de usuarios
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
import { User, getRoleName } from "../../types/User";
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const Users: React.FC = () => {
    const navigate = useNavigate();
    const { users: userData, error: userError, loading: userLoading, getAllUsers } = useUser();

    useEffect(() => {
        getAllUsers();
    }, []);

    const [showRecords] = useState<string>("50");
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectPage, setSelectPage] = useState(false);
    const [alertMessage, setAlertMessage] = useState<String | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage = parseInt(showRecords);

    const handleSelectPage = () => {
        if (selectPage) {
            setSelectedUsers([]);
        } else {
            const pageUserIds = currentUsers.map(user => user.id_user);
            setSelectedUsers(pageUserIds);
        }
        setSelectPage(!selectPage);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            const allUserIds = userData.map(user => user.id_user);
            setSelectedUsers(allUserIds);
        }
        setSelectAll(!selectAll);
    };

    const handleSelect = (userId: number) => {
        setSelectedUsers((prevSelected) => {
            const updatedSelection = prevSelected.includes(userId)
                ? prevSelected.filter(id => id !== userId)
                : [...prevSelected, userId];
            return updatedSelection;
        });
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentUsers = userData.slice(indexOfFirstRecord, indexOfLastRecord);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Table columns
    const columns: { key: keyof (User & { checkbox: JSX.Element; actions: JSX.Element }); label: string | JSX.Element }[] = [
        {
            key: "checkbox", label:
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectPage}
                    onChange={handleSelectPage}
                    disabled={selectAll}
                />
        },
        { key: "name", label: "Nombre" },
        { key: "last_name", label: "Apellido" },
        { key: "email", label: "Correo" },
        { key: "tuition", label: "Matrícula" },
        { key: "role", label: "Rol" },
        { key: "status", label: "Estado" },
        { key: "actions", label: "Acciones" },
    ];

    const createUserArray = (userData: User[]) => {
        return userData.map(user => ({
            name: user.name,
            last_name: user.last_name,
            email: user.email,
            tuition: user.tuition,
            role: user.role,
            status: user.status ? "Activo" : "Inactivo",
        }));
    };

    const handleExportUsers = (type: string) => {
        const users = createUserArray(userData);
        if (users.length === 0) {
            setAlertMessage("No hay usuarios para exportar");
            setTimeout(() => setAlertMessage(null), 3000);
            return;
        }
        if (type === "PDF") {
            exportToPDF(users, {
                title: "Lista de Usuarios",
                filename: "lista_usuarios.pdf",
                headers: ["Nombre", "Apellido", "Correo", "Matrícula", "Rol", "Estado"],
                keys: ["name", "last_name", "email", "tuition", "role", "status"]
            });
        }
        if (type === "EXCEL") {
            exportToExcel(users);
        }
        setAlertMessage(null);
    };

    if (userLoading) return <Loading />;

    if (userError) {
        const errorMessage = [userError && `Users -> ${userError}`].filter(Boolean).join(" | ");
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
                                    type="checkbox"
                                    style={{ fontSize: "25px", marginRight: "10px", marginTop: "-4px" }}
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    disabled={selectPage}
                                />
                                <label><strong>Todos los usuarios ({userData.length})</strong></label>
                            </div>
                        </div>

                        <div className={styles[`button-ticketss`]}>
                            <div className="btn-group" role="group">
                                <button type="button" className="btn btn-outline-dark" onClick={() => handleExportUsers("EXCEL")}>Excel</button>
                                <button type="button" className="btn btn-outline-dark" onClick={() => handleExportUsers("PDF")}>PDF</button>
                            </div>
                        </div>

                        <div className={styles[`button-ticketss`]}>
                            <Button text="Agregar Usuario" variant="secondary active" size="md" onClick={() => navigate("/auth/users/create")} />
                        </div>
                    </div>

                    <div className={styles[`container-2`]} style={{ height: "auto" }}>
                        <Table
                            data={currentUsers.map(user => ({
                                ...user,
                                checkbox: (
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id_user)}
                                        onChange={() => handleSelect(user.id_user)}
                                        disabled={selectAll}
                                    />
                                ),
                                role: getRoleName(user.role),   
                                status: (
                                    <span className={user.status ? "text-success" : "text-danger"}>
                                      <FontAwesomeIcon icon={user.status ? faCheckCircle : faTimesCircle} />{" "}
                                      {user.status ? 'Activo' : 'Inactivo'}
                                    </span>
                                  ),
                                actions: (
                                    <Button
                                        text={<FontAwesomeIcon icon={faEdit} />}
                                        onClick={() => navigate(`/auth/users/update/${user.id_user}`)}
                                        variant="success"
                                        size="md"
                                        title="Actualizar"
                                    />
                                )
                            }))}
                            columns={columns}
                        />


                    </div>

                    <Pagination
                        currentPage={currentPage}
                        recorsPerPage={recordsPerPage}
                        totalRecords={userData.length}
                        paginate={paginate}
                    />
                </div>
            </div>
        </div>
    );
};

export default Users;
