import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import { Table, type Column } from "../../components/ui/Table";
import type { Membership_type } from "../../interface/membership";
import memberships from "../../JSON/membership.json"

const Membership: React.FC = () => {

    // 1) tableTitle
    const tableTitle: Column<Membership_type>[] = [
        { key: "member", header: "Member" },
        { key: "phoneNo", header: "Number" },
        { key: "tier", header: "Tier" },
        { key: "joined", header: "Joined" },
        {
            key: "privileges",
            header: "Privileges",
            render: (row) => (
                <span> {row.privileges} privileges </span>
            )
        },
        {
            key: "",
            header: "",
            render: () => (
                <button className="border border-border p-1 px-2 text-black text-sm rounded-md">
                    Edit
                </button>
            )
        },
    ];
    
    return (
        <>
            {/* Create */}
            <Grid className="md:grid-cols-4 items-center">
                <span className="text-title">{memberships.length} memberships</span>
                <Button icon={Plus} label='Create Membership' className="md:col-start-4"/>
            </Grid>
            {/* table */}
            <Grid>
                <Table fieldName={tableTitle} data={memberships} />
            </Grid>
        </>
    )
}

export default Membership;