interface FieldOption {
    label: string;
    value: string | number;
}

interface FieldProps {
    label: string;
    type?: 'text'|'number'|'date'|'select';
    placeholder?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    options?: FieldOption[];
}

export default function Field({ label, type = "text", placeholder, value, onChange, error, required = false, disabled = false, options = [] }: FieldProps) {
    return (
        <div>
            <label className="block mb-1.5 text-sm font-medium text-title">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>

            {type === "select" ? (
                <select
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition text-title disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100" : "border-gray-300 focus:border focus:ring-2 focus:ring-border"}`}
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
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition placeholder:text-title/40 text-title disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100" : "border-gray-300 focus:border-border focus:ring-2 focus:ring-border"}`}
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