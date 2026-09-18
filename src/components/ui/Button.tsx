interface ButtonProps {
  icon?: React.ElementType;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
}

export default function Button({ icon: Icon, label, onClick, className, disabled = false }: ButtonProps) {
  return (
    <div className={className}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`py-2 w-full rounded-xl bg-secondary text-black text-md font-bold transition-all flex items-center justify-center gap-2 ${disabled ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-1 cursor-pointer"}`}
      >
        {Icon && <Icon size={18} />}
        <span>{label}</span>
      </button>
    </div>
  );
}