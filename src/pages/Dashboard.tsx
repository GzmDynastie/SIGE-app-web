import { useTickets } from "../hooks/useTickets";
import { TicketsByAreaBar, SubnetsBar } from "../components/ui/graphics/ChartGenericBar";
import Sidebar from "../components/Sidebar";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import styles from "../styles/components/Card.module.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler, ArcElement, PointElement, LineElement } from "chart.js";
import { useEffect } from "react";
import { useSubnets } from "../hooks/useSubnets";
import KPIs from "../components/ui/graphics/KPIs";
import { TicketPie, LoanPie } from "../components/ui/graphics/ChartGenericPie";
import { useLoans } from "../hooks/useLoans";
import { HistoricalLoan, HistoricalTicket } from "../components/ui/graphics/ChartGenericLine";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler, ArcElement, PointElement, LineElement);
const token = localStorage.getItem("token");
if (token) {
    console.log("Token encontrado:", token);
} else {
    console.log("No hay token en localStorage");
}

const Modules: React.FC = () => {
    const { tickets: ticketData, error: ticketError, loading: ticketLoading, getAllTickets } = useTickets();
    const { subnets: subnetData, error: subnetError, loading: subnetLoading, getAllSubnets } = useSubnets();
    const { loans: loanData, error: loanError, loading: loanLoading, fetchLoans } = useLoans();

    useEffect(() => {
        getAllTickets();
        getAllSubnets();
        fetchLoans();
    }, [])

    if (ticketLoading || subnetLoading || loanLoading) return <Loading />;

    if (ticketError) {
        return <Alert text={`Error: Tickets -> ${ticketError}`} variant="alert alert-danger" iconVariant="error" />;
    }

    if (ticketError || subnetError || loanError) {
        const errorMessage = [
            ticketError && `Tickets -> ${ticketError}`,
            subnetError && `Subredes -> ${subnetError}`,
            loanError && `Prestamos -> ${loanError}`]
            .filter(Boolean)
            .join(" | ");

        return <Alert text={`Error: ${errorMessage}`} variant="alert alert-danger" iconVariant="error" />;
    }

    return (
        <div className={styles.body}>
            <div className="app-container">
                <div className={styles[`modules-container`]}>
                    <Sidebar />
                    <div className={styles[`content-master`]}>
                        <div className={styles[`content-container`]}>
                            <div className={styles[`container-KPI`]}>
                                <KPIs title="Tickets Abiertos" size={ticketData.filter(t => t.status === "abierto").length} />
                                <KPIs title="Equipos Registrados" size={15} />
                                <KPIs title="Reportes Generados" size={ticketData.length} />
                            </div>
                        </div>

                        <div className={styles[`content-container`]}>
                            <div className={styles[`container-graphics-pie`]}>
                                <TicketPie ticketData={ticketData} />
                                <LoanPie loanData={loanData} />
                            </div>

                            <div className={styles[`container-graphics-bar`]}>
                                <TicketsByAreaBar ticketData={ticketData} />
                                <SubnetsBar subnetData={subnetData} />
                            </div>

                            <div className={styles[`container-graphics-line`]}>
                                <HistoricalTicket ticketData={ticketData} />
                                <HistoricalLoan loanData={loanData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modules;