import Grid from "../../components/ui/Grid";
import Table, { type Column } from "../../components/ui/Table";
import type { Customer_type } from "../../interface/customer";
import customers from "../../JSON/customer.json"

const Customers: React.FC = () => {

    // 1) tableTitle
    const tableTitle: Column<Customer_type>[] = [
        {
            key: "customer",
            header: "Customer",
            render: (row) => (
                <div className="flex items-center gap-3 whitespace-nowrap">
                    <span className="font-bold text-secondary w-8 h-8 bg-tertiary rounded-full flex items-center justify-center">
                        {row.customer.charAt(0)}
                    </span>

                    <span className="font-semibold text-black">
                        {row.customer}
                    </span>
                </div>
            )
        },
        { key: "phoneNo", header: "Phone" },
        { key: "email", header: "Email" },
        { key: "membership", header: "Membership" },
        { key: "booking", header: "Booking" },
    ];
    
    return (
        <>
            {/* filter */}
            <Grid className="md:grid-cols-4">
                <button>hai</button>
                <div/>
                <div/>
                <button>hai</button>
            </Grid>
            {/* table */}
            <Grid>
                <Table fieldName={tableTitle} data={customers} />
            </Grid>
        </>
    )
}

export default Customers;