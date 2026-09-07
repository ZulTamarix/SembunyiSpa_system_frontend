import { Table, type Column } from "../../components/ui/Table";
import type { Booking_type } from "../../interface/booking";
import bookings from "../../JSON/booking.json"
import Grid from "../../components/ui/Grid";

const Bookings: React.FC = () => {

    // 1) tableTitle
    const tableTitle: Column<Booking_type>[] = [
        {
            key: "id",
            header: "Booking ID",
            render: (row) => (
            <span className="text-sm text-[#8a8175] font-mono">{row.id}</span>
            ),
        },
        {
            key: "customer",
            header: "Customer",
            render: (row) => (
                <div>
                    <div className="font-semibold text-black">{row.customer}</div>
                    <span>{row.phoneNo}</span>
                </div>
            )
        },
        { key: "treatment", header: "Treatment" },
        {
            key: "date",
            header: "Date & Time",
            render: (row) => (
            <div>
                <div>{row.date}</div>
                <div className="text-sm text-[#8a8175]">{row.time}</div>
            </div>
            ),
        },
        { key: "therapist", header: "Therapist" },
        { key: "room", header: "Room" },
        { key: "status", header: "Status" },
        { key: "payment", header: "Payment" },
    ];

    // 2) searchbar

    return (
        <>
            {/* <Grid>
                
            </Grid> */}
            <Grid>
                <Table fieldName={tableTitle} data={bookings} />
            </Grid>
        </>
    )
}

export default Bookings;