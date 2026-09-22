import type { LucideIcon } from "lucide-react";

interface Tab {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface TabsProps {
    tabs: Tab[];
    active: string;
    setActive: (id: string) => void;
    className?: string;
}

export default function Tabs({ tabs, active, setActive, className }: TabsProps) {
    return (
        <nav className={`${className} rounded-full border border-border bg-white p-1.5 gap-2 shadow-sm`}>
            {tabs.map(({ id, label, icon: Icon }) => {
                const isActive = active === id;

                return (
                    <button
                        key={id}
                        onClick={() => setActive(id)}
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                            isActive
                                ? "bg-secondary text-black"
                                : "text-title hover:bg-secondary hover:text-black hover:rounded-full"
                        }`}
                    >
                        <Icon size={16} strokeWidth={2.4} />
                        {label}
                    </button>
                );
            })}
        </nav>
    );
}
