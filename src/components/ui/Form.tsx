import { X } from "lucide-react";
import type { ReactNode } from "react";

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export default function Form({ isOpen, onClose, title, children, footer, width = "max-w-lg" }: FormProps) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

            {/* Form */}
            <div className={` relative w-full ${width} max-h-[85vh] flex flex-col rounded-xl shadow-2xl border border-gray-200 overflow-hidden  `}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-2 bg-white border-b border-border">
                    <h2 className="text-lg font-semibold text-title">
                        {title}
                    </h2>

                    <button onClick={onClose} className=" p-1.5 rounded-lg text-secondary hover:bg-gray-100 hover:text-title transition cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 py-5 bg-tertiary">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-5 px-5 py-2 border-t border-border bg-gray-50">
                        {footer}
                    </div>
                )}
                
            </div>
        </div>
    );
}