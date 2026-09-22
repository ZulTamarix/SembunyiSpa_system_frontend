import Grid from "../../components/ui/Grid";
import { useCallback, useEffect, useState } from "react";
import { Sparkles, ClipboardList } from "lucide-react";
import api from "../../api/axios";
import type { User_therapist_json } from "../../interface/user";
import Tabs from "../../components/ui/Tab";

const Therapist: React.FC = () => {

    //#region 0) --> main
    
        // set CRUD's State
        // const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        // const [isLoading, setIsLoading] = useState(false);

        // swap section
        const [active, setActive] = useState("staff");
        const tabs = [
            { id: "staff", label: "Staff Directory", icon: Sparkles },
            { id: "duty", label: "Duty Roster", icon: ClipboardList },
        ];
        useEffect(() => {
            switch(active) {
                case 'staff': 
                break;
                case 'duty': 
                break;
            }
        },[active])
    //#endregion

    //#region 1) --> therapist
        const [databaseTherapist, setDatabase_therapist] = useState<User_therapist_json[]>([])
        const fetchData_therapist = useCallback(() => {

            api.get('/user', {
                params: {
                    role: 'therapist'
                }
            })
            .then((response) => {
                setDatabase_therapist(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }, [])

        // fetch database
        useEffect(() => {
            fetchData_therapist()
        }, [])
    //#endregion

    //#region 2) --> roster
    //#endregion


    return (
        <>
            {/* #region 0) --> main */}
            <>
                <Grid className="md:grid-cols-5">
                    <Tabs className="col-span-2 grid grid-cols-2" tabs={tabs} active={active} setActive={setActive} />
                </Grid>
            </>

            {/* #region 1) --> therapist */}
            {active == 'staff' && (
                <>
                    {/* Create */}
                    <Grid className="md:grid-cols-5 items-center">
                        <span className="text-title">{databaseTherapist.length} staff members</span>
                        {/* <Button icon={Plus} label='Add Therapist' className="md:col-start-5"/> */}
                    </Grid>
                    
                    {/* table */}
                    <Grid className="md:grid-cols-3">
                        {databaseTherapist.map((data) => (
                            <div key={data.MAIN_DATA.id} className="w-full rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tertiary">
                                            <span className="text-xl font-bold text-secondary">
                                                {data.user.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-stone-900">{data.user.name}</h2>
                                            <p className="text-sm text-title">{data.MAIN_DATA.code}</p>
                                        </div>
                                    </div>

                                    <span className="whitespace-nowrap rounded-full bg-tertiary px-2 py-1 text-xs text-title font-semibold tracking-wide">
                                        {data.MAIN_DATA.position}
                                    </span>
                                </div>

                                {/* Details */}
                                <div className="mt-5 space-y-2 text-[15px] ">
                                    <div className="flex items-center justify-between">
                                        <span className="text-title">Phone</span>
                                        <span className="font-medium text-title">{data.user.phoneNo}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-title">Email</span>
                                        <span className="font-medium text-title">{data.user.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-title">Bookable</span>
                                        <span className="font-medium text-title">No</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Grid>
                </>
            )}

            {/* #region 2) --> roster */}
            {active == 'duty' && (
                <>
                </>
            )}

        </>
    )
}

export default Therapist;