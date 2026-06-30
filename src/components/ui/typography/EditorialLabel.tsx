import React from "react";

interface EditorialLabelProps {
    children: React.ReactNode;
    className?: string;
}

export const EditorialLabel: React.FC<EditorialLabelProps> = ({ children, className = "" }) => {
    return (
        <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/40 ${className}`}>
            {children}
        </span>
    );
};
