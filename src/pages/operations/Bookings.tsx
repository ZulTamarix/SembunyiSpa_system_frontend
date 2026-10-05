import { Table, type Column } from "../../components/ui/Table";
import type { Booking_type } from "../../interface/booking";
import bookings from "../../JSON/booking.json"
import Grid from "../../components/ui/Grid";
import Button from "../../components/ui/Button";
import { Plus } from "lucide-react";
import Searchbar from "../../components/ui/Searchbar";
import { useState } from "react";
import Form from "../../components/ui/Form";
import Field from "../../components/ui/Field";

const Bookings: React.FC = () => {

    // #region 1) --> useState
        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        const [isLoading, setIsLoading] = useState(false);
        // form
        const [form_booking, setForm_booking] = useState(false);

    //#endregion
    // #region 3) --> method
        const handleCreate_booking = () => {

        }
    //#endregion

    // #region 4) --> database
        // tableTitle
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
    //#endregion



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
                    <Button onClick={() => { setForm_booking(true); setCrud('create')}} icon={Plus} label='Create Booking' className="md:col-start-5"/>
                </div>
            </Grid>
            
            {/* Table */}
            {/* <Grid>
                <Table fieldName={tableTitle} data={bookings} />
            </Grid> */}
            
            {/* Create */}
            <Form title={crud=='create'? 'Add Category':'Edit Category'} isOpen={form_booking} onClose={() => setForm_booking(false)} width="max-w-lg"
                
                footer={
                    <>
                        <Button
                            label="Cancel"
                            className="w-24"
                            onClick={() => setForm_booking(false)}
                            disabled={isLoading}
                        />

                        {crud == 'create' ? (
                            <Button
                                label="Save"
                                className="w-24"
                                onClick={handleCreate_booking}
                                disabled={isLoading}
                            />
                        ) : (

                            <Button
                                label="Update"
                                className="w-24"
                                onClick={handleCreate_booking}
                                disabled={isLoading}
                            />
                        )}

                    </>
                }
            >
                <div className="space-y-4">
                    {/* <Field
                        label="Name"
                        placeholder="Body Message, Facial, ..."
                        value={category.name}
                        onChange={(e) => setCategory({...category, name:e.target.value})}
                    /> */}
                </div>
            </Form>
        </>
    )
}

export default Bookings;