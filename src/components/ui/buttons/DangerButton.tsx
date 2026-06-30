import React from "react";

interface DangerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const DangerButton: React.FC<DangerButtonProps> = ({ children, className = "", ...props }) => {
    return (
        <button
            className={`w-full group flex items-center justify-center gap-3 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300 transition-all duration-300 ${className}`}
            {...props}
        >
            <span className="uppercase tracking-[0.2em] text-xs font-semibold">{children}</span>
        </button>
    );
};
