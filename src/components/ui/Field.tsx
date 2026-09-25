interface FieldOption {
    label: string;
    value: string | number;
}

interface FieldProps {
    label: string;
    type?: 'text' | 'number' | 'date' | 'time' | 'select' | 'file' | 'textarea';
    placeholder?: string;
    value?: string | number;
    accept?: string;
    onChange?: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    options?: FieldOption[];
}

export default function Field({
    label,
    type = "text",
    placeholder,
    value,
    accept,
    onChange,
    error,
    required = false,
    disabled = false,
    options = []
}: FieldProps) {
    return (
        <div>
            <label className="block mb-1.5 text-sm font-medium text-title">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>

            {/* 1) select option */}
            {type === "select" ? (
                <select
                    value={value}
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
            // 2) file 
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
            // 3) textarea
            type === "textarea" ? (
                <textarea
                    placeholder={placeholder}
                    value={value}
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
            // 4) others
            (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
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