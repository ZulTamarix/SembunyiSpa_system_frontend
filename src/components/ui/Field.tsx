interface FieldOption {
    label: string;
    value: string | number;
}

interface FieldProps {
    label: string;
    type?: 'text' | 'number' | 'date' | 'time' | 'button' | 'select' | 'file' | 'textarea' | 'switch';
    placeholder?: string;
    value?: string | number | boolean;
    accept?: string;
    onChange?: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => void;
    onClick?: () => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    options?: FieldOption[];
}

export default function Field({ label, type = "text", placeholder, value, accept, onChange, onClick, error, required = false, disabled = false, options = [] }: FieldProps) {
    return (
        <div>
            <label className="block mb-1.5 text-sm font-medium text-title">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>

            {/* 1) button */}
            {type === "button" ? (
                <input
                    type="button"
                    value={value as string}
                    onClick={onClick}
                    disabled={disabled}
                    className="w-full rounded-lg border border-gray-300 bg-secondary px-3 py-2.5 text-sm text-black font-bold cursor-pointer transition-all hover:-translate-x-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
            ) :
            // 2) select option 
            type === "select" ? (
                <select
                    value={value as string | number}
                    onChange={onChange}
                    disabled={disabled}
                    className={`bg-white w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition text-title disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        error
                            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "border-gray-300 focus:border-border focus:ring-2 focus:ring-border"
                    }`}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}

                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

            ) :
            // 3) switch
            type === "switch" ? (
                <div className="flex items-center h-10.5">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={Boolean(value)}
                            onChange={onChange}
                            disabled={disabled}
                            className="sr-only peer"
                        />

                        <div className="relative w-16 h-8 bg-gray-300 rounded-md peer peer-checked:bg-secondary peer-disabled:opacity-50 peer-disabled:cursor-not-allowed after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-sm after:h-6 after:w-5 after:transition-all peer-checked:after:translate-x-9"/>
                    </label>
                </div>
            ) :
            // 4) file
            type === "file" ? (
                <input
                    type="file"
                    accept={accept}
                    onChange={onChange}
                    disabled={disabled}
                    className={`bg-white w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition text-title disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        error
                            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "border-gray-300 focus:border-border focus:ring-2 focus:ring-border"
                    }`}
                />

            ) :
            // 5) textarea
            type === "textarea" ? (
                <textarea
                    placeholder={placeholder}
                    value={value as string}
                    onChange={onChange}
                    disabled={disabled}
                    rows={4}
                    className={`bg-white w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition placeholder:text-title/40 text-title resize-y disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        error
                            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "border-gray-300 focus:border-border focus:ring-2 focus:ring-border"
                    }`}
                />

            ) :
            // 6) others
            (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value as string | number}
                    onChange={onChange}
                    disabled={disabled}
                    className={`bg-white w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition placeholder:text-title/40 text-title disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        error
                            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "border-gray-300 focus:border-border focus:ring-2 focus:ring-border"
                    }`}
                />
            )}

            {error && (
                <p className="mt-1.5 text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}