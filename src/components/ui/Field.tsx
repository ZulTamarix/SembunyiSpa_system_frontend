import { useState } from "react";

interface FieldOption {
    label: string;
    value: string | number;
    search?: string[];
    display?: string[];
}

interface FieldProps {
    label?: string;
    type?: 'text' | 'number' | 'date' | 'time' | 'button' | 'select' | 'select-searchable' | 'file' | 'textarea' | 'switch';
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
    
    // #region 1) --> 'select-searchable' only
        const [search, setSearch] = useState("");
        const [open, setOpen] = useState(false);
        const filteredOptions = options.filter((option) => {
            if (!option.search) {
                return option.label.toLowerCase().includes(search.toLowerCase());
            }

            return option.search.some((item) =>
                item.toLowerCase().includes(search.toLowerCase())
            );
        });
    //#endregion

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
            // 2) select option (normal)
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
            // 3) select option (searchable)
            type === "select-searchable" ? (
                <div className="relative">
                    <input
                        type="text"
                        placeholder={placeholder || "Search..."}
                        value={
                            open
                                ? search
                                : options.find((option) => option.value === value)?.label || ""
                        }
                        onFocus={() => {
                            setOpen(true);
                            setSearch("");
                        }}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setOpen(true);
                        }}
                        disabled={disabled}
                        className={`bg-white w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition text-title disabled:bg-gray-100 disabled:cursor-not-allowed ${
                            error
                                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                : "border-gray-300 focus:border-border focus:ring-2 focus:ring-border"
                        }`}
                    />

                    {open && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        onMouseDown={() => {
                                            const fakeEvent = {
                                                target: {
                                                    value: option.value,
                                                },
                                            } as React.ChangeEvent<HTMLSelectElement>;

                                            onChange?.(fakeEvent);

                                            setSearch("");
                                            setOpen(false);
                                        }}
                                        className="cursor-pointer px-3 py-2.5 text-sm text-title hover:bg-tertiary"
                                    >
                                        {option.display ? (
                                            <div>
                                                {option.display.map((item, index) => (
                                                    <div key={index}>{item}</div>
                                                ))}
                                            </div>
                                        ) : (
                                            option.label
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-2.5 text-sm text-gray-400">
                                    No results found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) :
            // 4) switch
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
            // 5) file
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
            // 6) textarea
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
            // 7) others
            (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value as string | number}
                    onChange={onChange}
                    disabled={disabled}
                    step={type === "time" ? 900 : undefined}
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
