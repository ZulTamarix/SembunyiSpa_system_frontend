// Grid.tsx
import React from "react";

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

export default function Grid({ children, className = "" }: GridProps) {
  return (
    <div className={`grid grid-cols-1 gap-5 pl-5 pr-5 mb-5 ${className}`}>
      {children}
    </div>
  );
}
