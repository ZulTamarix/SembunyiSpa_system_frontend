interface LabelProps {
    children: React.ReactNode;
}

export default function Label({ children }: LabelProps) {
    return (
        <span className="inline-flex items-center justify-center gap-1 rounded-xl bg-primary px-3 py-1 text-sm font-medium text-slate-200">
            {children} Record
        </span>
    );
}