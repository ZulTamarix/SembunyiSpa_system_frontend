import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import therapists from "../../JSON/therapist.json"

const Therapist: React.FC = () => {

    return (
        <>
            {/* Create */}
            <Grid className="md:grid-cols-5 items-center">
                <span className="text-title">{therapists.length} staff members</span>
                <Button icon={Plus} label='Add Therapist' className="md:col-start-5"/>
            </Grid>
            
            {/* table */}
            <Grid className="md:grid-cols-3">
                {therapists.map((data) => (
                    <div key={data.code} className="w-full rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-tertiary">
                                    <span className="text-2xl font-bold text-secondary">
                                        {data.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-stone-900">{data.name}</h2>
                                    <p className="text-sm text-title mt-1 ">{data.code}</p>
                                    <p className="text-sm text-title">{data.designation}</p>
                                </div>
                            </div>

                            <span className="whitespace-nowrap rounded-full bg-tertiary px-3 py-1.5 text-xs text-title font-semibold tracking-wide">
                                {data.title}
                            </span>
                        </div>

                        {/* Details */}
                        <div className="mt-6 space-y-1 text-[15px]">
                            <div className="flex items-center justify-between">
                                <span className="text-title">Phone</span>
                                <span className="font-medium text-title">{data.phoneNo}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-title">Email</span>
                                <span className="font-medium text-title">{data.email}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-title">Bookable</span>
                                <span className="font-medium text-title">
                                    {data.bookable ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex gap-3">
                            <button className="flex-1 rounded-full border border-stone-200 py-1 text-sm font-semibold text-title transition-colors hover:bg-stone-50">
                                Edit
                            </button>
                            <button className="flex-1 rounded-full border border-rose-200 py-1 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-50">
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </Grid>
        </>
    )
}

export default Therapist;