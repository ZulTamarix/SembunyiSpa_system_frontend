import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import { Table, type Column } from "../../components/ui/Table";
import type { User_type } from "../../interface/user";
import users from "../../JSON/user.json"

const User: React.FC = () => {

    // 1) tableTitle
    const tableTitle: Column<User_type>[] = [
        {
            key: "name",
            header: "Name",
            render: (row) => (
                <div className="flex items-center gap-3 whitespace-nowrap">
                    <span className="font-bold text-secondary w-8 h-8 bg-tertiary rounded-full flex items-center justify-center">
                        {row.name.charAt(0)}
                    </span>

                    <span className="font-semibold text-black">
                        {row.name}
                    </span>
                </div>
            )
        },
        { key: "role", header: "Role" },
        { key: "email", header: "Email" },
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
                <span className="text-title">System user accounts</span>
                <Button icon={Plus} label='Add User' className="md:col-start-5"/>
            </Grid>
            {/* table */}
            <Grid>
                <Table fieldName={tableTitle} data={users} />
            </Grid>
        </>
    )
}

export default User;