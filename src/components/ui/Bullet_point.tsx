import { useState } from "react";

interface Bullet_pointProps {
    value?: string[];
    onChange?: (details: string[]) => void;
    label?: string;
    placeholder?: string;
}

const Bullet_point = ({
    value,
    onChange,
    label = "Details",
    placeholder = "Press ENTER to add more",
}: Bullet_pointProps) => {
    const [details, setDetails] = useState<string[]>(value?.length ? value : [""]);

    const updateDetails = (updatedDetails: string[]) => {
        setDetails(updatedDetails);
        onChange?.(updatedDetails);
    };

    const handleDetailChange = (index: number, value: string) => {
        const updatedDetails = [...details];
        updatedDetails[index] = value;

        updateDetails(updatedDetails);
    };

    const handleDetailKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const updatedDetails = [...details];
            updatedDetails.splice(index + 1, 0, "");

            updateDetails(updatedDetails);

            setTimeout(() => {
                document.getElementById(`detail-${index + 1}`)?.focus();
            }, 0);
        }

        if (
            e.key === "Backspace" &&
            details[index] === "" &&
            details.length > 1
        ) {
            e.preventDefault();

            const updatedDetails = [...details];
            updatedDetails.splice(index, 1);

            updateDetails(updatedDetails);

            setTimeout(() => {
                document.getElementById(`detail-${index - 1}`)?.focus();
            }, 0);
        }
    };

    return (
        <div className="col-span-2">
            <label className="block mb-1.5 text-sm font-medium text-title">
                {label}
            </label>

            <div className="space-y-2">
                {details.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span className="text-title text-lg">•</span>

                        <input
                            id={`detail-${index}`}
                            type="text"
                            value={detail}
                            onChange={(e) =>
                                handleDetailChange(index, e.target.value)
                            }
                            onKeyDown={(e) =>
                                handleDetailKeyDown(index, e)
                            }
                            placeholder={placeholder}
                            className="bg-white w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-title/40 text-title focus:border-border focus:ring-2 focus:ring-border"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bullet_point;
