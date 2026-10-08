import { useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({ open, title, description, cancelLabel = "Cancel", confirmLabel = "Confirm", onCancel, onConfirm }: ConfirmDialogProps) {
    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e:any) => e.key === "Escape" && onCancel();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div onClick={onCancel} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                aria-describedby="dialog-desc"
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="dialog-title" className="text-lg font-semibold text-gray-900">
                    {title}
                </h2>
                <p id="dialog-desc" className="mt-2 text-sm leading-relaxed text-gray-600">
                    {description}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onCancel} className="rounded-xl border border-gray-300 bg-secondary px-4 py-2 text-md font-bold text-black transition-all hover:-translate-y-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400">
                        {cancelLabel}
                    </button>
                    <button onClick={onConfirm} autoFocus className="rounded-xl bg-secondary px-4 py-2 text-md font-bold text-black transition-all hover:-translate-y-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2">
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}