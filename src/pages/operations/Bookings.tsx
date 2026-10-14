import type { Booking_json, Booking_selected_type, Booking_type } from "../../interface/booking";
import Grid from "../../components/ui/Grid";
import Button from "../../components/ui/Button";
import { Plus } from "lucide-react";
import Searchbar from "../../components/ui/Searchbar";
import { useCallback, useEffect, useState } from "react";
import Form from "../../components/ui/Form";
import Field from "../../components/ui/Field";
import type { User_type } from "../../interface/user";
import api from "../../api/axios";
import Card from "../../components/ui/Card";
import { getCurrentDate } from "../../utils/date";
import Table, { type Column } from "../../components/ui/Table";
// import { getCurrentDate, getCurrentTime } from "../../utils/date";


const Bookings: React.FC = () => {

    // #region 1) --> useState
        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        const [isLoading, setIsLoading] = useState(false);
        // switch option
        const [type, setType] = useState<"Package" | "Service">("Package");
        // form
        const [form_booking, setForm_booking] = useState(false);
        // fieldname
        const [booking, setBooking] = useState<Booking_type>({
            id: 0,
            user_id: 0,
            package_id: null,
            date_start: '',
            time_start: '',
            time_end: '',
            booking_type: 'prepaid',
            status: 'booked',
            payment: 'pending',
            remark: ''
        })
        const [booking_selected, setBooking_selected] = useState<Booking_selected_type>({
            id: 0,
            booking_id: 0,
            service_id: 0,
            room_id: 0,
            user_id: 0,
        })
        const [isWalkin, setIs_walkin] = useState(false)
        // walkin
        const [userWalkin, setUser_walkin] = useState<User_type>({
            id: 0,
            role: 'walkin',
            name: '',
            email: '',
            phoneNo: '',
            status: 'active',
            password: '',
            date_joined: getCurrentDate(),
            specialty: '',
            code: ''
        })
        // temporary
        const [temp_package, setTemp_package] = useState<any | null>(null)
        // const [new_therapist, ] = useState<any | null>(null)
        const [new_therapist, setNew_therapist] = useState<any | null>(null)
        // loading state
        const [spinner, setSpinner] = useState(false)

    //#endregion
   

    // #region 2) --> useEffect
        
        // reset fieldname everytime form closed
        useEffect(() => {
            if(!form_booking) {
                setBooking ({
                    id: 0,
                    user_id: 0,
                    package_id: null,
                    date_start: '',
                    time_start: '',
                    time_end: '',
                    booking_type: 'prepaid',
                    status: 'booked',
                    payment: 'pending',
                    remark: ''
                })
                setBooking_selected ({
                    id: 0,
                    booking_id: 0,
                    service_id: 0,
                    room_id: 0,
                    user_id: 0,
                })
                setUser_walkin({
                    id: 0,
                    role: 'walkin',
                    name: '',
                    email: '',
                    phoneNo: '',
                    status: 'active',
                    password: '',
                    date_joined: getCurrentDate(),
                    specialty: '',
                    code: ''
                })
                setIs_walkin(false)
            }
        }, [form_booking])
        
        // reset fieldname everytime switch toggled
        useEffect(() => {
            if(isWalkin) {
                setBooking((prev) => ({
                    ...prev,
                    user_id: 0
                }))
            }
            else {
                setUser_walkin({
                    id: 0,
                    role: 'walkin',
                    name: '',
                    email: '',
                    phoneNo: '',
                    status: 'active',
                    password: '',
                    date_joined: getCurrentDate(),
                    specialty: '',
                    code: ''
                })
            }
        }, [isWalkin])

        // check availability
        useEffect(() => {

            if (booking.date_start && booking.time_start) {

                // 0) check time
                    if (booking.time_start) {
                        const minute = parseInt(booking.time_start.split(":")[1]);

                        if (![0, 15, 30, 45].includes(minute)) {
                            alert("Please select a time at 00, 15, 30, or 45 minutes. ❌");
                            return;
                        }

                    }

                // 1) calculate 'time_end'
                    const [hours, minutes] = booking.time_start.split(":").map(Number);
                    const totalMinutes = hours * 60 + minutes + temp_package.package.duration;
                    const time_end = `${String(Math.floor(totalMinutes / 60) % 24).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
                    setBooking((prev)=> ({
                        ...prev,
                        time_end: time_end
                    }))

                // 2) fetch all 'therapist_id'
                    const therapist_list = temp_package.package_therapist.map(
                        (item: any) => item.user_id
                    );

                // 3) check availability
                    api.get(`/available/therapist`, {
                        params: {
                            date: booking.date_start,
                            time_start: booking.time_start,
                            time_end: time_end,
                            therapist_list: therapist_list
                        }
                    })
                    .then((response) => {
                        console.log('therapist = ',response.data)
                        console.log('room = ',temp_package.package_room)

                        // store data
                        setNew_therapist(response.data)
                        setBooking_selected((prev) => ({
                            ...prev,
                            user_id: response?.data[0]?.id || 0,
                            room_id: temp_package.package_room[0].room_id //KIV
                        }))
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error.data);
                    });
            }
        }, [booking.date_start, booking.time_start])
   
    //#endregion


    // #region 3) --> method

        const handleCreate_booking = async () => {

            // setIsLoading(true)
            console.log('book = ',booking)
            console.log('book select = ',booking_selected)
            try {

                // if (isWalkin) {

                //     // 1. Create user first
                //     const response = await api.post(`/user`, {
                //         role: userWalkin.role,
                //         name: userWalkin.name,
                //         email: userWalkin.email,
                //         phoneNo: userWalkin.phoneNo,
                //         password: userWalkin.password,
                //         date_joined: userWalkin.date_joined,
                //     })

                //     const userId = response.data.id

                //     console.log('Created user id = ', userId)

                //     // 2. Create booking only if user creation succeeds
                //     await api.post(`/booking`, {
                //         booking: {
                //             ...booking,
                //             user_id: userId
                //         },
                //         booking_selected: booking_selected
                //     })

                // }
                // else {

                //     // Existing user - create booking directly
                //     await api.post(`/booking`, {
                //         booking: booking,
                //         booking_selected: booking_selected
                //     })

                // }

                // setForm_booking(false)
                // fetchData_booking()
            }
            catch (error) {
                console.error('Error:', error)
                // console.error('Response:', error.response?.data)
            }
            finally {
                setIsLoading(false)
            }
        }

    //#endregion


    // #region 4) --> database
        // tableTitle
        const tableTitle: Column<any>[] = [
            {
                key: "id",
                header: "Booking ID",
                render: (row) => (
                    <span className="text-sm text-[#8a8175] font-mono">{row.user.id}</span>
                ),
            },
            {
                key: "name",
                header: "Customer",
                render: (row) => (
                    <div>
                        <div className="font-semibold text-black">{row.user.name}</div>
                        <span className="text-xs">{row.user.phoneNo}</span>
                    </div>
                )
            },
            {
                key: "treatment",
                header: "Treatment",
                render: (row) => (
                    <span>{row.booking_selected.package.title}</span>
                ),
            },
            {
                key: "date",
                header: "Date & Time",
                render: (row) => (
                <div>
                    <div className="font-semibold text-black">{row.booking.date_start}</div>
                    <span className="text-xs">{row.booking.time_start}</span>
                </div>
                ),
            },
            {
                key: "therapist",
                header: "Therapist",
                render: (row) => (
                    <span>{row.booking_selected.user.name}</span>
                ),
            },
            {
                key: "room",
                header: "Room",
                render: (row) => (
                    <span>{row.booking_selected.room.name}</span>
                ),
            },
            {
                key: "status",
                header: "Status",
                render: (row) => (
                    <span>{row.booking.status}</span>
                ),
            },
            {
                key: "payment",
                header: "Payment",
                render: (row) => (
                    <span>{row.booking.payment}</span>
                ),
            },
        ];

        // a) user/customer
        const [databaseUser, setDatabase_user] = useState<User_type[]>([])
        const fetchData_user = useCallback(() => {

            api.get(`/user`, {
                params: {
                    role: 'customer',
                    extra_1: 'include walk in',
                }
            })
            .then((response) => {
                // console.log('data = ',response.data)
                setDatabase_user(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }, [])

        // b) package
        const [databasePackage, setDatabase_package] = useState<any[]>([])
        const fetchData_package = useCallback(() => {
            api.get(`/package`, {
                params: {
                    switch: 'package',
                    extra: 'for_booking'
                }
            })
            .then((response) => {
                // 1) normal
                // console.log('data = ',response.data)
                setDatabase_package(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error.data);
            });
        }, [])
        
        // c) service
        const [databaseService, setDatabase_service] = useState<any[]>([])
        const fetchData_service = useCallback(() => {
            api.get(`/package`, {
                params: {
                    switch: 'service',
                    extra: 'for_booking'
                }
            })
            .then((response) => {
                // 1) normal
                // console.log('data = ',response.data)
                setDatabase_service(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error.data);
            });
        }, [])

        // d) booking
        const [databaseBooking, setDatabase_booking] = useState<any[]>([])
        const fetchData_booking = useCallback(() => {
            setSpinner(true)
            api.get(`/booking`, {
                params: {
                    switch: 'booking',
                }
            })
            .then((response) => {
                console.log('data = ',response.data)
                setDatabase_booking(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error.data);
            })
            .finally(() => {
                setSpinner(false)
            })
        }, [])

        useEffect(() => {
            fetchData_user()
            fetchData_package()
            fetchData_service()
            fetchData_booking()
        }, [])
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
                    {/* <Button onClick={() => navigate("/packages/create")} icon={Plus} label='Create Booking' className="md:col-start-5"/> */}
                </div>
            </Grid>
            
            {/* Table */}
            <Grid>
                <Table fieldName={tableTitle} data={databaseBooking} loading={spinner} />
            </Grid>
            
            {/* Create */}
            <Form title={crud=='create'? 'Add Booking':'Edit Booking'} isOpen={form_booking} onClose={() => setForm_booking(false)} width="max-w-4xl"
                
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

                    {/* 1) Customer */}
                    <Card>
                        {/* <label className="block mb-2 text-md font-medium text-title"> Select Customer </label> */}
                        <div className="grid grid-cols-1 gap-5 mb-5 md:grid-cols-4">
                            {/* searcbar */}
                            <div className="col-span-3">
                                <Field
                                    label="Select Customer"
                                    placeholder="Search by phone number"
                                    value={booking.user_id}
                                    onChange={(e) => setBooking({...booking, user_id: Number(e.target.value)})}
                                    type="select-searchable"
                                    options={[
                                        ...databaseUser.map((user) => ({
                                            label: user.name,
                                            value: user.id,
                                            search: [
                                                user.name,
                                                user.phoneNo
                                            ],
                                            display: [
                                                user.name,
                                                `+ ${user.phoneNo}`
                                            ],
                                        }))
                                    ]}
                                    disabled={isWalkin}
                                />
                            </div>
                            {/* switch */}
                            <div className="col-start-4">
                                <Field
                                    label={`${isWalkin? 'Walk in' : 'Registered customer'}`}
                                    value={isWalkin}
                                    onChange={(e) => setIs_walkin((e.target as HTMLInputElement).checked)}
                                    type="switch"
                                />
                            </div>
                            
                            {/* walkin only */}
                            {isWalkin && (
                                <div className="col-span-4">
                                    <div className="grid grid-cols-1 gap-5 mb-5 md:grid-cols-3">
                                        <Field
                                            label="Name"
                                            placeholder="Enter name"
                                            value={userWalkin.name}
                                            onChange={(e) => setUser_walkin({ ...userWalkin, name: e.target.value })}
                                        />
                                        <Field
                                            label="Email"
                                            placeholder="Enter email"
                                            value={userWalkin.email}
                                            onChange={(e) => setUser_walkin({ ...userWalkin, email: e.target.value })}
                                        />
                                        <Field
                                            label="Phone"
                                            placeholder="Enter phone number"
                                            value={userWalkin.phoneNo}
                                            onChange={(e) => setUser_walkin({ ...userWalkin, phoneNo: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}


                            {/* remark */}
                            <div className="col-span-2">
                                <Field
                                    label="Remark"
                                    placeholder="Make remark for therapist"
                                    value={booking.remark}
                                    onChange={(e) => setBooking({...booking, remark: e.target.value})}
                                    type="textarea"
                                />
                            </div>

                            {/* type */}
                            <div className="col-span-2">
                                <Field
                                    label="Booking Type"
                                    value={booking.booking_type}
                                    onChange={(e) => setBooking({...booking, booking_type: e.target.value as 'prepaid' | 'walkin'})}
                                    type="select"
                                    options={[
                                        { label: 'Prepaid', value: 'prepaid' },
                                        { label: 'Walk in', value: 'walkin' },
                                    ]}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* 2) Package */}
                    <Card>

                        {/* header */}
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-md font-medium text-title">
                                Select {type}
                            </label>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setType(type === "Package" ? "Service" : "Package")}
                                    className={`relative w-20 h-6 rounded-full transition-colors cursor-pointer ${
                                        type === "Package" ? "bg-gray-300" : "bg-secondary"
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                            type === "Service" ? "translate-x-14" : ""
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* package / service */}
                        <div className="flex flex-col gap-3">
                            { type == 'Package' ? (
                                <>
                                    {databasePackage.map((pkg) => {
                                        const isSelected = booking.package_id === pkg.package.id;

                                        return (
                                            <div 
                                                key={pkg.package.id}
                                                onClick={() => {
                                                    setBooking({ ...booking, package_id: pkg.package.id })
                                                    setTemp_package(pkg);
                                                }}
                                                className={`flex items-center gap-4 p-4 border hover:bg-tertiary transition-colors rounded-2xl cursor-pointer
                                                    ${isSelected ? 'bg-tertiary border-primary' : 'bg-white border-border'}
                                                `}>
                                                {/* poster */}
                                                <img
                                                    src={`http://localhost:8000/${pkg.package.poster}`}
                                                    alt={pkg.package.title}
                                                    className="w-18 h-18 rounded-2xl object-cover"
                                                />

                                                {/* detail */}
                                                <div className="flex-1">
                                                    <h3 className="text-md text-black font-medium">{pkg.package.title}</h3>
                                                    <p className="text-sm text-title"> RM {pkg.package.price} </p>
                                                    <p className="text-sm text-title"> {pkg.package.duration} min </p>  
                                                </div>

                                                {/* category */}
                                                    <span className="px-3 py-0.5 bg-tertiary border border-border text-black text-sm rounded-full">
                                                        {pkg.package_category.name}
                                                    </span>
                                            </div>
                                        )
                                    })}
                                </>
                            ) : 
                            type == 'Service' ? (
                                <>
                                    {databaseService.map((pkg) => {
                                        const isSelected = temp_package == pkg

                                        return (
                                            <div 
                                                onClick={() => {
                                                    setBooking_selected({ ...booking_selected, service_id: pkg.package.id })
                                                    setTemp_package(pkg);
                                                }}
                                                className={`flex items-center gap-4 p-4 border hover:bg-tertiary transition-colors rounded-2xl cursor-pointer
                                                    ${isSelected ? 'bg-tertiary border-primary' : 'bg-white border-border'}
                                                `}>
                                                {/* poster */}
                                                <img
                                                    src={`http://localhost:8000/${pkg.package.poster}`}
                                                    alt={pkg.package.title}
                                                    className="w-18 h-18 rounded-2xl object-cover"
                                                />

                                                {/* detail */}
                                                <div className="flex-1">
                                                    <h3 className="text-md text-black font-medium">{pkg.package.title}</h3>
                                                    <p className="text-sm text-title"> RM {pkg.package.price} </p>
                                                    <p className="text-sm text-title"> {pkg.package.duration} min </p>  
                                                </div>

                                                {/* category */}
                                                <span className="px-3 py-0.5 bg-tertiary border border-border text-black text-sm rounded-full">
                                                    {pkg.package_category.name}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </>
                            ) : (
                                <>
                                </>
                            )}

                        </div>
                    </Card>

                    {/* 3) Schedule */}
                    {(temp_package) && (
                        <Card>
                            <label className="block mb-2 text-md font-medium text-title"> Select Date, Time & Therapist </label>
                            
                            <div className="grid cols-1 md:grid-cols-2 gap-5">
                                <Field
                                    label="Date"
                                    value={booking.date_start}
                                    onChange={(e) =>
                                        setBooking({
                                            ...booking,
                                            date_start : e.target.value,
                                        })
                                    }
                                    type="date"
                                />
                                
                                <Field
                                    label="Time (15, 30, 45, 00 minute only)"
                                    value={booking.time_start}
                                    onChange={(e) =>
                                        setBooking({
                                            ...booking,
                                            time_start: e.target.value,
                                        })
                                    }
                                    type="time"
                                />

                                {(booking.time_start && booking.date_start) && (
                                    <>
                                        {type == 'Package' ? (
                                            <>
                                                <Field
                                                    label="Available therapist"
                                                    value={booking_selected.user_id}
                                                    onChange={(e) =>
                                                        setBooking({
                                                            ...booking,
                                                            time_start: e.target.value,
                                                        })
                                                    }  
                                                    type="select"
                                                    options={
                                                        new_therapist.map((item:any) => ({
                                                            label: `${item.name} --> ${item.specialty}`,
                                                            value: item.id
                                                        }))
                                                    }
                                                />
                                                <Field
                                                    label="Available room"
                                                    value={booking_selected.room_id}
                                                    onChange={(e) =>
                                                        setBooking({
                                                            ...booking,
                                                            time_end: e.target.value,
                                                        })
                                                    }  
                                                    type="select"
                                                    options={
                                                        temp_package.package_room.map((item:any) => ({
                                                            label: `${item.room.name} --> ${item.room.description}`,
                                                            value: item.room.id
                                                        }))
                                                    }
                                                />
                                            </>
                                        ) : 
                                        type == 'Service' ? (
                                            <>
                                                <Field
                                                    label={`Available therapist ${new_therapist?.length==0 ? '(no therapist available ❌)': ''}`}
                                                    value={booking_selected.user_id}
                                                    onChange={(e) =>
                                                        setBooking_selected({
                                                            ...booking_selected,
                                                            user_id: Number(e.target.value),
                                                        })
                                                    }  
                                                    type="select"
                                                    options={
                                                        new_therapist?.map((item:any) => ({
                                                            label: `${item.name} --> ${item.specialty}`,
                                                            value: item.id
                                                        }))
                                                    }
                                                />
                                                <Field
                                                    label="Available room"
                                                    value={booking_selected.room_id}
                                                    onChange={(e) =>
                                                        setBooking_selected({
                                                            ...booking_selected,
                                                            room_id: Number(e.target.value),
                                                        })
                                                    }  
                                                    type="select"
                                                    options={
                                                        temp_package.package_room.map((item:any) => ({
                                                            label: `${item.room.name} --> ${item.room.description}`,
                                                            value: item.room.id
                                                        }))
                                                    }
                                                />
                                            </>
                                        ) : (
                                            <>
                                            </>
                                        )}
                                    </>
                                )}

                            </div>
                        </Card>
                    )}

                </div>
            </Form>
        </>
    )
}

export default Bookings;