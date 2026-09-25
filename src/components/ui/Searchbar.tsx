import React from "react";

interface SearchbarProps {
    placeholder?: string;
    className?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

export function Searchbar({placeholder, className = "", value, onChange, type = "text"}: SearchbarProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`p-3 h-10 rounded-xl border border-border focus:outline-none focus:ring-0 focus:border-border
        ${className}`}
    />
  );
}

export default Searchbar;