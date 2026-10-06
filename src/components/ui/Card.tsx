import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export default function Card({ children, className }: CardProps) {
    return (
        <div className={`rounded-2xl border border-border bg-white ${className}`}>
            {/* body */}
            <div className="rounded-2xl bg-white p-5">
                {children}
            </div>
        </div>
    );
}