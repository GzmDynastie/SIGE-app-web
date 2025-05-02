import Card from "../../Card";
import { Line } from "react-chartjs-2";
import { Ticket } from "../../../types/Ticket";
import { Loan } from "../../../types/Loan";

const labels = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

interface TicketProps {
    ticketData: Ticket[];
}

interface LoanProps {
    loanData: Loan[];
}

const options = {
    responsive: true,
    plugins: {
        legend: {
            display: true,
            position: "top" as const,
            labels: {
                color: "#333",
                font: {
                    size: 14,
                },
            },
        },
        title: {
            display: false,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
        },
        x: {
            ticks: {
                color: 'rgb(54, 162, 235)',
            },
        },
    },
};

const HistoricalTicket: React.FC<TicketProps> = ({ ticketData }) => {
    const ticketsPorMesData = ticketData.reduce((acc, ticket) => {
        if (ticket.creation_date) {
            const creationDate = ticket.creation_date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');
            const month = new Date(creationDate).getMonth();
            // const month = new Date(ticket.creation_date).getMonth();
            acc[month] = (acc[month] || 0) + 1;
        }
        return acc;
    }, {} as Record<number, number>);

    const historialTickets = {
        labels: labels,
        datasets: [
            {
                label: "Historial de Tickets",
                data: Array.from({ length: 12 }, (_, i) => ticketsPorMesData[i] || 0),
                tension: 0.5,
                fill: true,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                pointRadius: 5,
                pointBorderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'rgb(54, 162, 235)',
            },
        ],
    };

    return (
        <Card>
            <div className="w-full flex flex-col items-center justify-center p-5 bg-gradient shadow-lg rounded-4" style={{width: "500px", height: "285px"}}>
                <h3 className="text-secondary mb-3 text-uppercase fw-bold" style={{marginTop: "-30px", fontWeight: "bold", marginLeft: "-25px"}}>
                    Historial de Tickets
                </h3>
                <div className="w-full h-[300px] md:h-[400px]" style={{ width: "480px", height: "220px", marginLeft: "-40px" }}>
                    <Line data={historialTickets} options={options} />
                </div>
            </div>
        </Card>
    );
};

const HistoricalLoan: React.FC<LoanProps> = ({ loanData }) => {
    const loansPorMesData = loanData.reduce((acc, loan) => {
        if (loan.date_start) {
            const month = new Date(loan.date_start).getMonth();
            acc[month] = (acc[month] || 0) + 1;
        }
        return acc;
    }, {} as Record<number, number>);

    const historicoPrestamos = {
        labels: labels,
        datasets: [
            {
                label: "Historial de Préstamos",
                data: Array.from({ length: 12 }, (_, i) => loansPorMesData[i] || 0),
                tension: 0.5,
                fill: true,
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                pointRadius: 5,
                pointBorderColor: 'rgb(255, 159, 64)',
                pointBackgroundColor: 'rgb(255, 159, 64)',
            },
        ],
    };

    return (
        <Card>
            <div className="w-full flex flex-col items-center justify-center p-5 bg-gradient shadow-lg rounded-4" style={{width: "500px", height: "315px"}}>
                <h3 className="text-secondary mb-3 text-uppercase fw-bold" style={{marginTop: "-30px", fontWeight: "bold", marginLeft: "-25px"}}>
                    Historial de Préstamos
                </h3>
                <div className="w-full h-[300px] md:h-[400px]" style={{ width: "480px", height: "250px", marginLeft: "-40px" }}>
                    <Line data={historicoPrestamos} options={options} />
                </div>
            </div>
        </Card>
    );
};

export { HistoricalTicket, HistoricalLoan };
