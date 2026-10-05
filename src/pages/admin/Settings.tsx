import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Field from "../../components/ui/Field";
import { useCallback, useEffect, useState } from "react";
import { Table, type Column } from "../../components/ui/Table";
import { ClipboardList, Component, Plus, Sparkles, Warehouse } from "lucide-react";
import Form from "../../components/ui/Form";
import api from "../../api/axios";
import Tabs from "../../components/ui/Tab";
import Label from "../../components/ui/Label";

const Settings: React.FC = () => {
    
    //#region 0 --> main
    
        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        const [isLoading, setIsLoading] = useState(false);

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