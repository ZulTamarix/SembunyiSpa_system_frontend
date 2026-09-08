import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import { Table, type Column } from "../../components/ui/Table";
import type { Document_type } from "../../interface/document";
import documents from "../../JSON/document.json"

const Documents: React.FC = () => {

    // 1) tableTitle
    const tableTitle: Column<Document_type>[] = [
        {
            key: "name",
            header: "Name",
            render: (row) => (
                <div className="flex items-center gap-3 whitespace-nowrap">
                    <span>📄</span>
                    <span className="font-semibold text-black">
                        {row.name}
                    </span>
                </div>
            )
        },
        { key: "type", header: "Type" },
        { key: "date", header: "Date" },
        { key: "access", header: "Access" },
        {
            key: "",
            header: "",
            render: () => (
                <button className="border border-border p-1 px-2 text-black text-sm rounded-md">
                    View
                </button>
            )
        },
    ];
    
    return (
        <>
            {/* Create */}
            <Grid className="md:grid-cols-4 items-center">
                <span className="text-title">Manage and share documents</span>
                <Button icon={Plus} label='Upload Document' className="md:col-start-4"/>
            </Grid>
            {/* table */}
            <Grid>
                <Table fieldName={tableTitle} data={documents} />
            </Grid>
        </>
    )
}

export default Documents;