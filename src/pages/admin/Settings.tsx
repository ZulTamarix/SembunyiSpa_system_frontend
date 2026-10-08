import Grid from "../../components/ui/Grid";
import { useEffect, useState } from "react";
import { ClipboardList, Sparkles } from "lucide-react";
import Tabs from "../../components/ui/Tab";

const Settings: React.FC = () => {
    
    //#region 0 --> main
    
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

    
    return (
        <>
            {/* #region 0 --> main */}
            <>
                <Grid className="md:grid-cols-2">
                    <Tabs className="grid grid-cols-2" tabs={tabs} active={active} setActive={setActive} />
                </Grid>
            </>
        </>
    )
}

export default Settings;