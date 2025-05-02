import { Bar } from "react-chartjs-2";
import { Ticket } from "../../../types/Ticket";
import { Subnet } from "../../../types/Subnet";
import Card from "../../Card";

interface TicketsByAreaProps {
    ticketData: Ticket[];
}

interface SubnetsProps {
    subnetData: Subnet[];
}

const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: "top" as const,
        },
        title: {
            display: false,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 10,
            },
        },
        x: {
            ticks: {
                color: 'rgb(54, 162, 235)',
            },
        },
    },
};

const TicketsByAreaBar: React.FC<TicketsByAreaProps> = ({ ticketData }) => {
    const ticketsByAreaData = ticketData.reduce((acc, ticket) => {
        if (ticket.division) {
            acc[ticket.division] = (acc[ticket.division] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const chartData = {
        labels: Object.keys(ticketsByAreaData),
        datasets: [
            {
                label: "Tickets por Área",
                data: Object.values(ticketsByAreaData),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(138, 43, 226, 0.6)",
                    "rgba(32, 178, 170, 0.6)",
                ],
                borderColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#8A2BE2",
                    "#20B2AA",
                ],
                borderWidth: 2,
            },
        ],
    };

    return (
        <Card>
            <div className="flex flex-col items-center justify-center p-5 bg-gradient shadow-lg rounded-4 w-full min-h-[300px]" style={{ width: "480px", height: "285px" }}>
                <h3 className="text-secondary mb-4 text-uppercase" style={{ marginTop: "-30px", fontWeight: "bold", marginLeft: "-25px" }}>
                    Tickets por Área
                </h3>
                <div className="w-full h-[300px] md:h-[400px]" style={{ width: "460px", height: "210px", marginLeft: "-40px" }}>
                    <Bar data={chartData} options={barOptions} />
                </div>
            </div>
        </Card>
    );
};

const SubnetsBar: React.FC<SubnetsProps> = ({ }) => {
    // const labels = subnetData.map((subnet) => `vlan ${subnet.vlan}`);
    // const usedPorts = subnetData.map((subnet) => subnet.used_ports);
    // const availablePorts = subnetData.map(
    //     (subnet) => subnet.number_of_ips - subnet.used_ports
    // );

    const data = {
        labels: ["vlan 10", "vlan 20", "vlan 30"],
        datasets: [
            {
                label: "Puertos Ocupados",
                data: [30, 50, 10],
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "#FF6384",
                borderWidth: 2,
            },
            {
                label: "Puertos Disponibles",
                data: [220, 200, 240],
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "#36A2EB",
                borderWidth: 2,
            },
        ],
    };

    // const data = {
    //     labels,
    //     datasets: [
    //         {
    //             label: "Puertos Ocupados",
    //             data: usedPorts,
    //             backgroundColor: "rgba(255, 99, 132, 0.6)",
    //             borderColor: "#FF6384",
    //             borderWidth: 2,
    //         },
    //         {
    //             label: "Puertos Disponibles",
    //             data: availablePorts,
    //             backgroundColor: "rgba(54, 162, 235, 0.6)",
    //             borderColor: "#36A2EB",
    //             borderWidth: 2,
    //         },
    //     ],
    // };

    return (
        <Card>
            <div className="flex flex-col items-center justify-center p-5 bg-gradient shadow-lg rounded-4 w-full min-h-[300px]" style={{ width: "480px", height: "315px" }}>
                <h3 className="text-secondary mb-3 text-uppercase font-bold" style={{ marginTop: "-30px", fontWeight: "bold", marginLeft: "-25px" }}>
                    Subredes
                </h3>
                <div className="w-full h-[300px] md:h-[400px]" style={{ width: "460px", height: "240px", marginLeft: "-40px" }}>
                    <Bar data={data} options={barOptions} />
                </div>
            </div>
        </Card>
    );
};

export { TicketsByAreaBar, SubnetsBar };
