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
                    <div className="font-semibold text-black">{row.customer}</div>
            )
        },
        { key: "phoneNo", header: "Phone Number" },
        { key: "email", header: "Email" },
        { key: "booking", header: "Booking" },
        { key: "membership", header: "Membership" },
    ];
    
    return (
        <>
            <Grid>
                <Table fieldName={tableTitle} data={customers} />
            </Grid>
        </>
    )
}

export default Customers;