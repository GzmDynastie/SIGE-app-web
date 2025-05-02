import Card from "../../Card";

interface KPIsProps {
    title: string;
    size: number;
}

const KPIs: React.FC<KPIsProps> = ({ title, size }) => {
    return (
        <Card>
            <div className="d-flex flex-column align-items-center justify-content-center p-3 p-md-2 bg-gradient shadow-none rounded-4 w-100">
                <h3 className="text-secondary mb-0 text-uppercase fw-bold text-center fs-5 fs-md-5">
                    {title}
                </h3>
                <span className="fs-4 fw-bold text-primary">{size}</span>
                <div className="progress w-100 mt-2" style={{ height: '0.5rem' }}>
                    <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style={{ width: `${Math.min(size, 100)}%` }}
                        aria-valuenow={size}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    ></div>
                </div>
            </div>
        </Card>
    );
};

export default KPIs;
