import React from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "secondary active" | "danger disabled" | "btn btn-outline-success" | "btn btn-outline-danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
    text?: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    onClick?: () => void;
    disabled?: boolean;
    title?: string;
    icon?: JSX.Element | JSX.Element[];
}

const Button: React.FC<ButtonProps> = ({ text, variant = "primary", size = "sm", onClick, disabled = false, title, icon }) => {
    return (
        <button
            disabled={disabled}
            className={`btn btn-${variant} btn-${size}`}
            onClick={onClick}
            title={title}
        >
            {<span style={{fontSize: "18px", fontWeight: "bold"}}>{text}</span>}
            {Array.isArray(icon) ? icon.map((i, idx) => <span style={{marginLeft: "10px"}} key={idx}>{i}</span>) : icon}
        </button>
    );
};

export default Button;