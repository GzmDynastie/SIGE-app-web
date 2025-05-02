import { Pie } from "react-chartjs-2";
import Card from "../../Card";
import { Ticket } from "../../../types/Ticket";
import { Loan } from "../../../types/Loan";

interface TicketPieProps {
    ticketData: Ticket[];
}

interface LoanPieProps {
    loanData: Loan[];
}

const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "bottom" as const,
            labels: {
                color: "#333",
                font: {
                    size: 14,
                },
            },
        },
        tooltip: {
            callbacks: {
                label: function (context: any) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    return `${label}: ${value}`;
                },
            },
        },
    },
};

const TicketPie: React.FC<TicketPieProps> = ({ ticketData }) => {
    const data = {
        labels: ["Abiertos", "Cerrados"],
        datasets: [
            {
                label: "Tickets por Estado",
                data: [
                    ticketData.filter((t) => t.status === "abierto").length,
                    ticketData.filter((t) => t.status === "cerrado").length,
                ],
                backgroundColor: ["#65859a", "#36A2EB"],
                borderColor: ["#4d6b7e", "#2a80c2"],
                borderWidth: 2,
            },
        ],
    };

    return (
        <Card>
            <div className="d-flex flex-column align-items-center justify-content-center p-3 bg-gradient shadow-lg rounded-4 w-100" style={{ height: "300px" }}>
                <h3 className="text-secondary mb-3 text-uppercase font-bold" style={{marginTop: "10px", fontWeight: "bold"}}>
                    Estado de Tickets
                </h3>
                <div className="w-100" style={{ height: "250px", paddingTop: "0px", paddingLeft: "20px", paddingRight: "20px"}}>
                    <Pie data={data} options={pieOptions} />
                </div>
            </div>
        </Card>
    );
};

const LoanPie: React.FC<LoanPieProps> = ({}) => {
    const data = {
        labels: ["Activos", "Completados"],
        datasets: [
            {
                label: "Préstamos",
                data: [20, 15],
                // data: [
                //     loanData.filter((l) => l.status === "abierto").length,
                //     loanData.filter((l) => l.status === "cerrado").length,
                // ],
                backgroundColor: ["#65859a", "#36A2EB"],
                borderColor: ["#4d6b7e", "#2a80c2"],
                borderWidth: 2,
            },
        ],
    };

    return (
        <Card>
            <div className="d-flex flex-column align-items-center justify-content-center p-3 bg-gradient shadow-lg rounded-4 w-100" style={{ height: "300px" }}>
                <h3 className="text-secondary mb-3 text-uppercase font-bold" style={{marginTop: "-30px", fontWeight: "bold"}}>
                    Estado de Préstamos
                </h3>
                <div className="w-100" style={{ height: "230px", marginBottom: "-40px", padding: "10px" }}>
                    <Pie data={data} options={pieOptions} />
                </div>
            </div>
        </Card>
    );
};

export { TicketPie, LoanPie };
