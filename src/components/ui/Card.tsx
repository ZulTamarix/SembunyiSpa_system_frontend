import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={`rounded-2xl border border-border overflow-hidden ${className}`}>
        {/* body */}
        <div className="p-5 bg-white">
            {children}
        </div>
    </div>
  );
}
