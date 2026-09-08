import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import { Table, type Column } from "../../components/ui/Table";
import vouchers from "../../JSON/voucher.json"
import type { Voucher_type } from "../../interface/vouchers";

const Membership: React.FC = () => {

    // 1) tableTitle
    const tableTitle: Column<Voucher_type>[] = [
        { key: "code", header: "Code" },
        { key: "description", header: "Description" },
        { key: "type", header: "Type" },
        { key: "customer", header: "Customer" },
        { key: "validTill", header: "Valid Till" },
        { key: "status", header: "Status" },
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
            <Grid className="md:grid-cols-5 items-center">
                <span className="text-title">{vouchers.length} vouchers</span>
                <Button icon={Plus} label='Create Voucher' className="md:col-start-5"/>
            </Grid>
            {/* table */}
            <Grid>
                <Table fieldName={tableTitle} data={vouchers} />
            </Grid>
        </>
    )
}

export default Membership;