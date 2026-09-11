import Card from "../../components/ui/Card";
import Grid from "../../components/ui/Grid";
import { Table, type Column } from "../../components/ui/Table";
import type { Booking_type } from "../../interface/booking";
import bookings from "../../JSON/booking.json"

const Dashboard: React.FC = () => {

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
        { key: "status", header: "Status" },
        { key: "payment", header: "Payment" },
    ];

    // 2) card style
    const titleStyle = "text-sm text-title font-semibold";
    const dataStyle = "text-3xl font-semibold font-serif";
    const infoStyle = "text-sm";

    return (
        <>
            {/* Info */}
            <Grid className="md:grid-cols-4">
                <Card>
                    <div className="flex flex-col">
                        <span className={titleStyle}>Total Bookings</span>
                        <span className={dataStyle}>3</span>
                        <span className={`${infoStyle} text-amber-400`}>↑ All time</span>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col">
                        <span className={titleStyle}>Upcoming</span>
                        <span className={dataStyle}>2</span>
                        <span className={`${infoStyle} text-blue-400`}>↑ Active bookings</span>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col">
                        <span className={titleStyle}>Customers</span>
                        <span className={dataStyle}>3</span>
                        <span className={`${infoStyle} text-purple-700`}>↑ Registered</span>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col">
                        <span className={titleStyle}>Therapists</span>
                        <span className={dataStyle}>4</span>
                        <span className={`${infoStyle} text-green-700`}>↑ 2 Available</span>
                    </div>
                </Card>
            </Grid>

            {/* Table */}
            <Grid>
                <Table fieldName={tableTitle} data={bookings.slice(0, 2)} />
            </Grid>
        </>
    )
}

export default Dashboard;