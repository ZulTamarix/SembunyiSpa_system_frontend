import { Table, type Column } from "../../components/ui/Table";
import type { Booking_type } from "../../interface/booking";
import bookings from "../../JSON/booking.json"
import Grid from "../../components/ui/Grid";
import Button from "../../components/ui/Button";
import { Plus } from "lucide-react";
import Searchbar from "../../components/ui/Searchbar";

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
            key: "name",
            header: "Customer",
            render: (row) => (
                <div>
                    <div className="font-semibold text-black">{row.name}</div>
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

    // 2) searchbars

    return (
        <>
            {/* filter */}
            <Grid className="md:grid-cols-5 items-center">
                <div className="md:col-span-5 bg-white p-3 rounded-xl grid md:grid-cols-5 items-center gap-4 border border-border overflow-hidden">
                    <Searchbar placeholder="Search by name,phone or booking ID..." className="md:col-span-3 bg-tertiary "/>
                    <select className="bg-tertiary px-3 h-10 rounded-xl border border-border focus:outline-none focus:ring-0 focus:border-border">
                        <option selected>All</option>
                        <option value=''>Confirmed</option>
                        <option value=''>Arrived</option>
                        <option value=''>Room Assigned</option>
                        <option value=''>In Treatment</option>
                        <option value=''>Completed</option>
                        <option value=''>Cancelled</option>
                    </select>
                    <Button icon={Plus} label='Create Booking' className="md:col-start-5"/>
                </div>
            </Grid>
            
            {/* Table */}
            <Grid>
                <Table fieldName={tableTitle} data={bookings} />
            </Grid>
        </>
    )
}

export default Bookings;