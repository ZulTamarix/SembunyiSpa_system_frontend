
interface ButtonProps {
  icon?: React.ElementType;
  label: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string
}

export default function Button({ icon: Icon, label, onClick, className }: ButtonProps) {
  return (
    <div className={`${className}`}>
        <button onClick={onClick} className="py-2 w-full rounded-xl bg-secondary text-black text-md hover:-translate-y-1 font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
          {Icon && <Icon size={18} />}
          <span>{label}</span>
        </button>
    </div>
  );
}