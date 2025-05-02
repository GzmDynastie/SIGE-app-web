import { TriangleAlert, CircleCheck, Info, CircleX } from "lucide-react";

type AlertVariant = "alert alert-primary" | "alert alert-secondary" | "alert alert-success" | "alert alert-danger" | "alert alert-warning" | "alert alert-info" | "alert alert-light" | "alert alert-dark";

const IconVariants = {
    "alert": <TriangleAlert />,
    "success": <CircleCheck />,
    "information": <Info />,
    "error": <CircleX />
} as const;

type IconVariant = keyof typeof IconVariants;

interface AlertProps {
    text?: string;
    variant?: AlertVariant;
    iconVariant?: IconVariant;
}

const Alert: React.FC<AlertProps> = ({ text, variant, iconVariant }) => {
    const Icon = iconVariant ? IconVariants[iconVariant] : null;

    return (
        <div className="container" style={{
            position: "absolute",
            top: "7%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "900px",
            width: "auto",
            justifyContent: "center",
        }}>
            <div className={variant} role="alert">
                {Icon} {text}
            </div>
        </div>
    );
}

export default Alert;