import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import packages from "../../JSON/packages.json"

const Packages: React.FC = () => {

    return (
        <>
            {/* Create */}
            <Grid className="md:grid-cols-5 items-center">
                <span className="text-title">{packages.length} packages</span>
                <Button icon={Plus} label='Add Package' className="md:col-start-5"/>
            </Grid>
            
            {/* table */}
            <Grid className="md:grid-cols-2">
                {packages.map((data) => (
                    <div key={data.id} className="w-full rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
                        {/* Header */}

                        <div className="flex items-center justify-between ">
                            <span className="whitespace-nowrap rounded-full bg-tertiary px-3 py-1.5 text-xs text-title font-bold tracking-wide uppercase">
                                {data.type}
                            </span>
                            <span className="text-lg font-bold">
                                RM {data.price}
                            </span>
                        </div>

                        {/* Title */}
                        <div className="mt-3 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h2 className="text-base font-serif font-bold text-stone-900 uppercase">{data.title}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-3 space-y-1 text-[15px]">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-title font-semibold">{data.description}</span>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="mt-3 space-y-1 text-[15px]">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-title font-semibold">{data.duration} min</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-3 flex gap-3">
                            <button className="flex-1 rounded-full border border-border py-1 text-sm font-semibold text-title transition-colors hover:bg-stone-50">
                                Edit
                            </button>
                            <button className="flex-1 rounded-full border border-border py-1 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-50">
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </Grid>
        </>
    )
}

export default Packages;