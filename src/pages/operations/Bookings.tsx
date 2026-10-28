import type { Booking_selected_type, Booking_type } from "../../interface/booking";
import Grid from "../../components/ui/Grid";
import Button from "../../components/ui/Button";
import { CheckIcon, Plus, Timeline } from "lucide-react";
import Searchbar from "../../components/ui/Searchbar";
import { useCallback, useEffect, useState } from "react";
import Form from "../../components/ui/Form";
import Field from "../../components/ui/Field";
import type { User_type, User_voucher_json } from "../../interface/user";
import api, { api_image } from "../../api/axios";
import Card from "../../components/ui/Card";
import { getCurrentTime } from "../../utils/date";
import Table, { type Column } from "../../components/ui/Table";
import Alert from "../../components/ui/Alert";
import type { Log_booking_type } from "../../interface/log_booking";

const Bookings: React.FC = () => {

    // #region 1) --> useState
        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        const [isLoading, setIsLoading] = useState(false);
        // selected id
        const [selectedId, setSelected_id] = useState(0);
        // detect error -> common
        const [isAlert, setIs_alert] = useState(false);
        // switch option
        const [type, setType] = useState<"Package" | "Service">("Package");
        // loading state
        const [spinner, setSpinner] = useState(false)
        // alert
        const [updatedType, setUpdated_type] = useState<'Start' | 'End' | 'Payment' | 'Booking'>('Start');
        // form
        const [form_booking, setForm_booking] = useState(false);
        const [form_log, setForm_log] = useState(false);
        // fieldname
            // booking
            const [booking, setBooking] = useState<Booking_type>({
                id: 0,
                user_id: 0,
                user_shared_id: null,
                package_id: null,
                date_start: '',
                time_start: '',
                time_end: '',
                booking_type: 'walkin',
                status: 'pending',
                payment: 'pending',
                price_original: 0,
                price_discount: 0,
                price_final: 0,
                remark: ''
            })
            const [booking_selected, setBooking_selected] = useState<Booking_selected_type>({
                id: 0,
                booking_id: 0,
                service_id: 0,
                room_id: 0,
                user_id: 0,
            })
            // log
            const [log, setLog] = useState<Log_booking_type[]> ([])
            // user(normal)
            const [isWalkin, setIs_walkin] = useState(false)
            const [userWalkin, setUser_walkin] = useState<User_type>({
                id: 0,
                role: 'walkin',
                name: '',
                email: '',
                phoneNo: '',
                status: 'active',
                password: '',
                specialty: '',
                code: ''
            })
            // user(shared)
            const [isShared, setIs_shared] = useState(false)
            const [isWalkin_shared, setIs_walkin_shared] = useState(false)
            const [userWalkin_shared, setUser_walkin_shared] = useState<User_type>({
                id: 0,
                role: 'walkin',
                name: '',
                email: '',
                phoneNo: '',
                status: 'active',
                password: '',
                specialty: '',
                code: ''
            })
        
        // temporary
            const [temp_package, setTemp_package] = useState<any | null>(null)
            const [temp_user, setTemp_user] = useState<User_type>()
            const [temp_userShared, setTemp_userShared] = useState<User_type>()
            const [temp_voucher, setTemp_voucher] = useState<any[]>([])
            const [temp_duration, setTemp_duration] = useState<any>({
                original: 0,
                extended: 0,
                final: 0
            })
        const [voucher_price_selectedId, setVoucher_price_selectedId] = useState<any>()
        const [voucher_duration_selectedId, setVoucher_duration_selectedId] = useState<any>()
        // const [new_therapist, ] = useState<any | null>(null)
        const [new_therapist, setNew_therapist] = useState<any | null>(null)
        const [new_room, setNew_room] = useState<any | null>(null)

    //#endregion
   

    // #region 2) --> useEffect
        
        // reset fieldname everytime form closed
        useEffect(() => {
            if(!form_booking) {
                setBooking ({
                    id: 0,
                    user_id: 0,
                    user_shared_id: null,
                    package_id: null,
                    date_start: '',
                    time_start: '',
                    time_end: '',
                    booking_type: 'prepaid',
                    status: `${crud=='edit'? 'booked' : 'pending'}`,
                    payment: 'pending',
                    price_original: 0,
                    price_discount: 0,
                    price_final: 0,
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
                    specialty: '',
                    code: ''
                })
                setUser_walkin_shared({
                    id: 0,
                    role: 'walkin',
                    name: '',
                    email: '',
                    phoneNo: '',
                    status: 'active',
                    password: '',
                    specialty: '',
                    code: ''
                })

                setTemp_package([])
                setTemp_user(undefined)
                setTemp_voucher([])
                setTemp_duration([])

                setVoucher_price_selectedId('')
                setVoucher_duration_selectedId('')

                setIs_shared(false)
                setIs_walkin(false)
                setIs_walkin_shared(false)
            }
        }, [form_booking])
        
        // reset fieldname everytime switch toggled (owner)
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
                    specialty: '',
                    code: ''
                })
            }
        }, [isWalkin])
        // reset fieldname everytime switch toggled (shared)
        useEffect(() => {
            if(isWalkin_shared) {
                setBooking((prev) => ({
                    ...prev,
                    user_shared_id: 0
                }))
            }
            else {
                setUser_walkin_shared({
                    id: 0,
                    role: 'walkin',
                    name: '',
                    email: '',
                    phoneNo: '',
                    status: 'active',
                    password: '',
                    specialty: '',
                    code: ''
                })
            }
        }, [isWalkin_shared])

        // set temporary user (owner)
        useEffect(() => {
            if(booking.user_id) {
                // check customer's name
                const user: any = databaseUser.find((item: any) => item.user.id === booking.user_id);
                setTemp_user(user.user)
                setTemp_voucher(user.voucherCustomers)
            }

        }, [booking.user_id])
        // set temporary user (shared)
        useEffect(() => {
            if(booking.user_shared_id) {
                // check customer's name
                const user: any = databaseUser.find((item: any) => item.user.id === booking.user_shared_id);
                setTemp_userShared(user.user)
            }

        }, [booking.user_shared_id])

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

                // 0) loading state
                    setSpinner(true)

                // 1) calculate 'time_end'
                    const [hours, minutes] = booking.time_start.split(":").map(Number);
                    // const totalMinutes = hours * 60 + minutes + temp_package.package.duration;
                    
                    let totalMinutes = 0
                    if(temp_duration.extended)
                        totalMinutes = (hours * 60 + minutes + temp_package.package.duration) + temp_duration.extended;
                    else
                        totalMinutes = hours * 60 + minutes + temp_package.package.duration;

                    const time_end = `${String(Math.floor(totalMinutes / 60) % 24).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
                    
                    setBooking((prev)=> ({
                        ...prev,
                        time_end: time_end
                    }))

                // 2) fetch all 'therapist_id' and 'room_id
                let therapist_list = {};
                let room_list = {};

                if(type == 'Package') {
                    therapist_list = [
                        ...new Set(
                            temp_package.package_service.flatMap(
                                (service: any) =>
                                    service.therapist.map((item: any) => item.user_id)
                            )
                        )
                    ];

                    room_list = [
                        ...new Set(
                            temp_package.package_service.flatMap(
                                (service: any) =>
                                    service.room.map((item: any) => item.id)
                            )
                        )
                    ];
                }
                else if(type == 'Service') {
                    therapist_list = temp_package.package_therapist.map(
                        (item: any) => item.user_id
                    );
                    room_list = temp_package.package_room.map(
                        (item: any) => item.id
                    );
                }

                // 3) check availability
                    api.get(`/available/therapist`, {
                        params: {
                            date: booking.date_start,
                            time_start: booking.time_start,
                            time_end: time_end,

                            therapist_list: therapist_list,
                            room_list: room_list
                        }
                    })
                    .then((response) => {
                        console.log('availability = ',response.data)

                        // store data
                        setNew_therapist(response.data.therapist)
                        setNew_room(response.data.room)

                        setBooking_selected((prev) => ({
                            ...prev,
                            user_id: response?.data?.therapist?.[0]?.id || 0,
                            room_id: response.data?.room?.[0]?.id || 0 //KIV
                        }))
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error.data);
                    })
                    .finally(() => {
                        setSpinner(false)
                    })
            }

        // }, [])
        }, [booking.date_start, booking.time_start, temp_duration])
   
        // calculate payment + duration
        useEffect(() => {

            // a) initial
            if(!voucher_price_selectedId && !voucher_duration_selectedId) {
                // time
                setTemp_duration({
                    original: temp_package?.package?.duration || 0,
                    extended: 0,
                    final: temp_package?.package?.duration || 0
                }) 
                // price
                let original = Number(temp_package?.package?.price) || 0;
                setBooking((prev) => ({
                    ...prev,
                    price_original: original,
                    price_discount: 0,
                    price_final: original
                }))
            }
            // b) price
            if(voucher_price_selectedId) {
                // selected voucher
                const selected_voucher: any = temp_voucher.find((item: any) => item.id == voucher_price_selectedId);

                // set price
                let original = Number(temp_package?.package?.price) || 0;
                let discount = Number(selected_voucher?.voucher?.discount_value) || 0

                // set discount
                switch(selected_voucher?.voucher?.discount_type) {
                    case 'discount_amount': discount = discount; break;
                    case 'discount_percentage':  discount = Number((Number(original) * (Number(discount) / 100)).toFixed(2)); break;
                    case 'time_extension': ; discount = 0; break;
                }

                // set booking
                setBooking((prev) => ({
                    ...prev,
                    price_original: original,
                    price_discount: discount,
                    price_final: original - discount
                }))
            }
            // c) duration
            if(voucher_duration_selectedId) {
                
                // selected voucher
                const selected_voucher: any = temp_voucher.find((item: any) => item.id == voucher_duration_selectedId);
                const original = temp_package?.package?.duration
                const extended = selected_voucher?.voucher?.discount_value || 0
                const final = temp_package?.package?.duration + selected_voucher?.voucher?.discount_value || 0

                if(selected_voucher) {
                    setTemp_duration({
                        original: original,
                        extended: extended,
                        final: final
                    }) 
                }
                else {
                    setTemp_duration({
                        original: original,
                        extended: 0,
                        final: original
                    }) 
                }
            }

        }, [voucher_price_selectedId, voucher_duration_selectedId, temp_package])

    //#endregion


    // #region 3) --> method

        // CREATE
        const handleCreate_booking = async () => {

            // loading
            setIsLoading(true)
            
            try {

                // make 'booking_selected' into an object array
                let booking_selected_new = {};
                if(type == 'Package') {
                    booking_selected_new = temp_package.package_service.map((item: any) => ({
                        ...booking_selected,
                        service_id: item.id
                    }));
                }
                else if(type == 'Service') {
                    booking_selected_new = [booking_selected];
                }

                // set walkin or not
                let userId = booking.user_id
                let userSharedId = booking?.user_shared_id || null
                if (isWalkin) {
                    // Create user first
                    const response = await api.post(`/user`, {
                        role: userWalkin.role,
                        name: userWalkin.name,
                        email: userWalkin.email,
                        phoneNo: userWalkin.phoneNo,
                        password: userWalkin.password,
                    })

                    userId = response.data.id
                }
                if (isWalkin_shared) {
                    // Create user first
                    const response = await api.post(`/user`, {
                        role: userWalkin_shared.role,
                        name: userWalkin_shared.name,
                        email: userWalkin_shared.email,
                        phoneNo: userWalkin_shared.phoneNo,
                        password: userWalkin_shared.password,
                    })

                    userSharedId = response.data.id
                }

                // Create booking
                await api.post(`/booking`, {
                    booking: {
                        ...booking,
                        user_id: userId,
                        user_shared_id: userSharedId
                    },
                    booking_selected: booking_selected_new,

                    customer_name: temp_user?.name || 0,
                    customer_shared_name: temp_userShared?.name || null,
                    package_name: temp_package.package.title,

                    voucher_customer_price_id: Number(voucher_price_selectedId) || 'blank',
                    voucher_customer_duration_id: Number(voucher_duration_selectedId) || 'blank',

                    role: 'customer'
                })

                setForm_booking(false)
                fetchData_booking()
                fetchData_user()
            }
            catch (error) {
                console.error('Error:', error)
                // console.error('Response:', error.response?.data)
            }
            finally {
                setIsLoading(false)
            }
        }
        // UPDATE
        const handleEdit_booking = (data: any) => {

            // a) package
            if(data.package) {
                const packages = databasePackage.find(item => item.package.id === data.booking.package_id);
                setTemp_package(packages)
                setType('Package')
            }
            // b) service
            else {
                const services = databaseService.find(item => item.package.id === data.booking_selected[0].package_id);
                setTemp_package(services)
                setType('Service')
            }

            setUpdated_type('Booking')
            setBooking(data.booking)
            setBooking((prev) => ({
                ...prev,
                status: 'booked'
            }))
            setBooking_selected(data.booking_selected)
            setCrud('edit')
            setForm_booking(true)
        }
        // EDIT
        const handleUpdate_booking = async () => {

            // loading
            setIsLoading(true)

            // UPDATE data
            try {
                if(updatedType == 'Start') {

                    await api.put(`/booking/${selectedId}`, {
                        // set based on 'type'
                        recorded_time_start: getCurrentTime(),
                        payment: 'paid',
                        status: 'in_treatment',
                        switch: 'start'
                    });
                }
                else if(updatedType == 'End') {
                    await api.put(`/booking/${selectedId}`, {
                        // set based on 'type'
                        recorded_time_end: getCurrentTime(),
                        status: 'completed',
                        switch: 'end'
                    });
                }
                else if(updatedType == 'Payment') {
                    await api.put(`/booking/${selectedId}`, {
                        // set based on 'type'
                        payment: 'paid',
                        switch: 'payment'
                    });
                }
                else if(updatedType == 'Booking') {

                    // assign 'room_id' and 'user_id'
                    Object.keys(booking_selected).forEach((key) => {
                        const index = Number(key);

                        if (!isNaN(index)) {
                            (booking_selected as any)[index].user_id = booking_selected.user_id;
                            (booking_selected as any)[index].room_id = booking_selected.room_id;
                        }
                    });

                    // Update booking
                    await api.put(`/booking/${booking.id}`, {
                        booking: booking,
                        booking_selected: booking_selected,

                        switch: 'booking'
                    })
                }

                fetchData_booking()
                setForm_booking(false)
                setIs_alert(false)
            }
            catch(error) {
                console.error('Error:', error); // use only to remove warning on vscode
                // console.error('Response status:', error.response?.data);
            }
            finally {
                setIsLoading(false)
            }
        }

    //#endregion


    // #region 4) --> database

        // a) user/customer
        const [databaseUser, setDatabase_user] = useState<User_voucher_json[]>([])
        const fetchData_user = useCallback(() => {

            api.get(`/user`, {
                params: {
                    role: 'customer',
                    extra: 'include_voucher'
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
                // console.log('data = ',response.data)
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

        // tableTitle
        const tableTitle_booking: Column<any>[] = [
            // {
            //     key: "id",
            //     header: "Booking ID",
            //     render: (row) => (
            //         <span className="text-sm text-title font-mono">{row.user.id}</span>
            //     ),
            // },
            {
                key: "name",
                header: "Customer",
                render: (row) => (
                    <div>
                        {row.user_shared ? (
                            <>
                                <div className="font-semibold text-black">{row.user_shared.name}</div>
                                <span className="text-xs">{row.user_shared.phoneNo}</span>
                            </>
                        ): (
                            <>
                                <div className="font-semibold text-black">{row.user.name}</div>
                                <span className="text-xs">{row.user.phoneNo}</span>
                            </>
                        )}
                    </div>
                )
            },
            {
                key: "treatment",
                header: "Treatment",
                render: (row) => (
                    <span>{row.package? row.package.title :  row.booking_selected[0].package.title}</span>
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
                    <span>{row.booking_selected[0]?.user?.name || '-'}</span>
                ),
            },
            {
                key: "room",
                header: "Room",
                render: (row) => (
                    <span>{row.booking_selected[0]?.room?.name}</span>
                ),
            },
            {
                key: "status",
                header: "Status",
                render: (row) => (
                    <>
                        {row.booking.status == 'pending'? (
                            <div className="flex justify-center">
                                <div className="flex items-center border border-border rounded-md overflow-hidden bg-white">
                                    <span className="px-4 py-1 text-sm font-medium">
                                        Pending
                                    </span>

                                    <button onClick={() => handleEdit_booking(row)} className="px-3 py-1 bg-secondary hover:opacity-70 transition-opacity text-black font-semibold cursor-pointer">
                                        <CheckIcon size={20}/>
                                    </button>
                                </div>
                            </div>
                        ) : 
                        row.booking.status == 'booked'? (
                            <span className="py-1 px-2 rounded-full bg-amber-100 text-amber-600">Booked</span>
                        ) : 
                        row.booking.status == 'in_treatment' ? (
                            <span className="py-1 px-2 rounded-full bg-amber-100 text-amber-600">In treatment</span>
                        ) : 
                        row.booking.status == 'completed' ? (
                            <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">Completed</span>
                        ): 
                        row.booking.status == 'cancel' ? (
                            <span className="py-1 px-2 rounded-full bg-red-100 text-red-600">Cancel</span>
                        ) : (
                            <>
                            </>
                        )}
                    </>
                ),
            },
            {
                key: "payment",
                header: "Payment",
                render: (row) => (
                    <>
                        {row.booking.status == 'pending' ? (
                            <span className="text-center">-</span>
                        ) :
                        row.booking.payment == 'paid' ? (
                            <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">Paid</span>
                        ) : 
                        row.booking.payment == 'pending' ? (
                            <div className="flex justify-center">
                                <div className="flex items-center border border-border rounded-md overflow-hidden bg-white">
                                    <span className="px-4 py-1 text-sm font-medium">
                                        Pending
                                    </span>

                                    <button onClick={() => {setIs_alert(true); setSelected_id(row.booking.id); setUpdated_type('Payment')}} className="px-3 py-1 bg-secondary hover:opacity-70 transition-opacity text-black font-semibold cursor-pointer">
                                        <CheckIcon size={20}/>
                                    </button>
                                </div>
                            </div>
                        ): 
                        row.booking.payment == 'cancel' ? (
                            <span className="py-1 px-2 rounded-full bg-red-100 text-red-600">Cancel</span>
                        ) : (
                            <>
                            </>
                        )}
                    </>
                ),
            },
            {
                key: "start",
                header: "Treatment Time",
                render: (row) => (
                    <>
                        <div className="flex justify-center">
                            <div className="flex items-center border border-border rounded-md overflow-hidden bg-white">
                                {row.booking.recorded_time_end ? (
                                    <>
                                        <span className="px-4 py-1 text-sm font-medium border-r border-border">
                                            {row.booking.recorded_time_start}
                                        </span>
                                        <span className="px-4 py-1 text-sm font-medium">
                                            {row.booking.recorded_time_end}
                                        </span>
                                    </>
                                ) : 
                                row.booking.recorded_time_start ? (
                                    <>
                                        <span className="px-4 py-1 text-sm font-medium">
                                            {row.booking.recorded_time_start}
                                        </span>
                                        <button onClick={() => {setIs_alert(true); setSelected_id(row.booking.id); setUpdated_type('End')}} className="px-3 py-1 bg-secondary hover:opacity-70 transition-opacity text-black font-semibold cursor-pointer">
                                            End
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => {setIs_alert(true); setSelected_id(row.booking.id); setUpdated_type('Start')}} className="px-5 py-2 bg-secondary hover:opacity-80 active:scale-95 transition-all text-black text-sm font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                            Start
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                ),
            },
            {
                key: "log",
                header: "History",
                align: "center",
                render: (row) => (
                    <>
                        {row.log.length > 0 ? (
                            <button onClick={() => {setLog(row.log); setForm_log(true)}} className="px-5 py-2 bg-secondary hover:opacity-80 active:scale-95 transition-all text-black text-sm font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <Timeline size={20}/>
                            </button>
                        ) : (
                            <>
                                <div className="font-bold">-</div>
                            </>
                        )}
                    </>
                ),
            },
        ];
        const tableTitle_log: Column<Log_booking_type>[] = [
            {
                key: "1",
                header: "Date",
                render: (row) => (
                    <span className="text-sm text-title font-mono">
                        {new Date(row.created_at).toLocaleDateString('en-CA')}
                    </span>
                ),
            },
            {
                key: "2",
                header: "Time",
                render: (row) => (
                    <span className="text-sm text-title font-mono">
                        {new Date(row.created_at).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        })}
                    </span>
                ),
            },
            {
                key: "3",
                header: "Action",
                render: (row) => (
                    <span className="text-sm text-title font-mono" dangerouslySetInnerHTML={{ __html: row.action }}></span>
                ),
            },
        ]
    //#endregion


    return (
        <>

            {/* filter */}
            <Grid className="md:grid-cols-5 items-center">
                <div className="md:col-span-5 bg-white p-3 rounded-xl grid md:grid-cols-5 items-center gap-4 border border-border overflow-hidden">
                    <Searchbar placeholder="Search by name,phone or booking ID..." className="md:col-span-3 bg-tertiary "/>
                    {/* <select className="bg-tertiary px-3 h-10 rounded-xl border border-border focus:outline-none focus:ring-0 focus:border-border">
                        <option selected>All</option>
                        <option value=''>Confirmed</option>
                        <option value=''>Arrived</option>
                        <option value=''>Room Assigned</option>
                        <option value=''>In Treatment</option>
                        <option value=''>Completed</option>
                        <option value=''>Cancelled</option>
                    </select> */}
                    <Button onClick={() => { setForm_booking(true); setCrud('create')}} icon={Plus} label='Create Booking' className="md:col-start-5"/>
                    {/* <Button onClick={() => navigate("/packages/create")} icon={Plus} label='Create Booking' className="md:col-start-5"/> */}
                </div>
            </Grid>
            
            {/* Table */}
            <Grid>
                <Table fieldName={tableTitle_booking} data={databaseBooking} loading={spinner} />
            </Grid>
            
            {/* Create */} {/*Booking*/}
            <Form title={crud=='create'? 'Add Booking':'Edit Booking'} isOpen={form_booking} onClose={() => setForm_booking(false)} width="max-w-6xl"
                
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
                                onClick={handleUpdate_booking}
                                disabled={isLoading}
                            />
                        )}

                    </>
                }
            >
                <div className="space-y-4 grid grid-cols-2 gap-5">

                    {/* 1a) Customer(normal) */}
                    <Card>
                        <div className="grid grid-cols-1 gap-5 mb-5 md:grid-cols-4">
                            {/* searcbar */}
                            <div className="col-span-3">
                                <Field
                                    label={`${isShared? 'Select Customer (Owner)' : 'Select Customer'}`}
                                    placeholder="Search by phone number"
                                    value={booking.user_id}
                                    onChange={(e) => setBooking({...booking, user_id: Number(e.target.value)})}
                                    type="select-searchable"
                                    options={[
                                        ...databaseUser.map((data) => ({
                                            label: data.user.name,
                                            value: data.user.id,
                                            search: [
                                                data.user.name,
                                                data.user.phoneNo
                                            ],
                                            display: [
                                                data.user.name,
                                                `+ ${data.user.phoneNo}`
                                            ],
                                        }))
                                    ]}
                                    disabled={isWalkin || crud=='edit'}
                                />
                            </div>
                            {/* switch to 'walkin' */}
                            <div className="col-start-4 col-span-3">
                                <Field
                                    label={`${isWalkin? 'Walk-in customer' : 'Registered customer'}`}
                                    value={isWalkin}
                                    onChange={(e) => setIs_walkin((e.target as HTMLInputElement).checked)}
                                    type="switch"
                                    disabled={crud == 'edit'}
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
                                            disabled={crud == 'edit'}
                                        />
                                        <Field
                                            label="Email"
                                            placeholder="Enter email"
                                            value={userWalkin.email}
                                            onChange={(e) => setUser_walkin({ ...userWalkin, email: e.target.value })}
                                            disabled={crud == 'edit'}
                                        />
                                        <Field
                                            label="Phone"
                                            placeholder="Enter phone number"
                                            value={userWalkin.phoneNo}
                                            onChange={(e) => setUser_walkin({ ...userWalkin, phoneNo: e.target.value })}
                                            disabled={crud == 'edit'}
                                        />
                                    </div>
                                </div>
                            )}
                            {/* divider */}
                            <div className="col-span-4 mt-3 border-t-2 border-border pt-5"></div>
                            
                            {/* remark */}
                            <div className="col-span-3">
                                <Field
                                    label="Remark"
                                    placeholder="Make remark for therapist"
                                    value={booking.remark}
                                    onChange={(e) => setBooking({...booking, remark: e.target.value})}
                                    type="textarea"
                                />
                            </div>
                            {/* switch to 'shared booking' */}
                            <div className="col-start-4 col-span-3">
                                <Field
                                    label={`${isShared? 'Shared booking' : 'Normal booking'}`}
                                    value={isShared}
                                    onChange={(e) => setIs_shared((e.target as HTMLInputElement).checked)}
                                    type="switch"
                                    disabled={crud == 'edit'}/>
                            </div>
                        </div>
                    </Card>
                    {/* 1b) Customer(shared) */}
                    {isShared && (
                        <>
                            {/* shared */}
                            <Card>
                                {/* <label className="block mb-2 text-md font-medium text-title"> Select Customer </label> */}
                                <div className="grid grid-cols-1 gap-5 mb-5 md:grid-cols-4">
                                    {/* searcbar */}
                                    <div className="col-span-3">
                                        <Field
                                            label="Select Customer (Shared)"
                                            placeholder="Search by phone number"
                                            value={booking?.user_shared_id || ''}
                                            onChange={(e) => setBooking({...booking, user_shared_id: Number(e.target.value)})}
                                            type="select-searchable"
                                            options={[
                                                ...databaseUser.map((data) => ({
                                                    label: data.user.name,
                                                    value: data.user.id,
                                                    search: [
                                                        data.user.name,
                                                        data.user.phoneNo
                                                    ],
                                                    display: [
                                                        data.user.name,
                                                        `+ ${data.user.phoneNo}`
                                                    ],
                                                }))
                                            ]}
                                            disabled={isWalkin_shared || crud == 'edit'}
                                        />
                                    </div>
                                    {/* switch */}
                                    <div className="col-start-4 col-span-3">
                                        <Field
                                            label={`${isWalkin_shared? 'Walk-in customer' : 'Registered customer'}`}
                                            value={isWalkin_shared}
                                            onChange={(e) => setIs_walkin_shared((e.target as HTMLInputElement).checked)}
                                            type="switch"
                                            disabled={crud == 'edit'}
                                        />
                                    </div>
                                    {/* walkin only */}
                                    {isWalkin_shared && (
                                        <div className="col-span-4">
                                            <div className="grid grid-cols-1 gap-5 mb-5 md:grid-cols-3">
                                                <Field
                                                    label="Name"
                                                    placeholder="Enter name"
                                                    value={userWalkin_shared.name}
                                                    onChange={(e) => setUser_walkin_shared({ ...userWalkin_shared, name: e.target.value })}
                                                    disabled={crud == 'edit'}
                                                />
                                                <Field
                                                    label="Email"
                                                    placeholder="Enter email"
                                                    value={userWalkin_shared.email}
                                                    onChange={(e) => setUser_walkin_shared({ ...userWalkin_shared, email: e.target.value })}
                                                    disabled={crud == 'edit'}
                                                />
                                                <Field
                                                    label="Phone"
                                                    placeholder="Enter phone number"
                                                    value={userWalkin_shared.phoneNo}
                                                    onChange={(e) => setUser_walkin_shared({ ...userWalkin_shared, phoneNo: e.target.value })}
                                                    disabled={crud == 'edit'}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                            {/* blank  */}
                            <div></div>
                        </>
                    )}

                    {/* 2) Package */}
                    <Card >

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
                                    disabled={crud == 'edit'}
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
                        <div className="flex flex-col gap-3 max-h-75 overflow-y-auto pr-2 scrollbar-hide">
                            { type == 'Package' ? (
                                <>
                                    {databasePackage.map((pkg) => {
                                        const isSelected = booking.package_id === pkg.package.id;

                                        return (
                                            <div 
                                                key={pkg.package.id}
                                                onClick={() => {
                                                    if (crud == 'edit') 
                                                        return;
                                                    setBooking({ ...booking, package_id: pkg.package.id })
                                                    setTemp_package(pkg);
                                                }}
                                                className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer
                                                    ${isSelected ? 'bg-tertiary border-primary' : 'bg-white border-border'}
                                                    ${crud == 'create'? ' hover:bg-tertiary transition-colors' : ''}
                                                `}>
                                                {/* poster */}
                                                <img
                                                    src={`${api_image}/${pkg.package.poster}`}
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
                                                    if (crud == 'edit') 
                                                        return;
                                                    setBooking_selected({ ...booking_selected, service_id: pkg.package.id })
                                                    setTemp_package(pkg);
                                                }}
                                                className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer
                                                    ${isSelected ? 'bg-tertiary border-primary' : 'bg-white border-border'}
                                                    ${crud == 'create'? ' hover:bg-tertiary transition-colors' : ''}
                                                `}>
                                                {/* poster */}
                                                <img
                                                    src={`${api_image}/${pkg.package.poster}`}
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
                    
                    {/* 3) + 4) + 5) */}
                    {( temp_package?.length!=0 && 
                        (
                            booking.user_id!=0 ||
                            (userWalkin.name && userWalkin.email && userWalkin.phoneNo)
                        )
                    ) && (
                        <>
                            {/* 3) Payment */}
                            <Card>
                                <label className="block mb-2 text-md font-medium text-title"> Payment </label>
                                
                                    {/* Price */}
                                    <div className="flex flex-col gap-2 text-sm border border-border p-3 rounded-xl">
                                        <div className="flex justify-between">
                                            <span className="text-title">Original Price</span>
                                            <span>RM {booking.price_original}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-title">Discount</span>
                                            <span className="text-danger">- RM {booking.price_discount}</span>
                                        </div>

                                        <div className="grid cols-1 md:grid-cols-5 gap-5 items-center">
                                            <div className="col-span-3">
                                                <span className="text-title">Apply voucher</span>
                                            </div>

                                            <div className="col-span-2">
                                                <Field
                                                    // label="Price (original)"
                                                    // value={booking.price_discount}
                                                    value={voucher_price_selectedId}
                                                    onChange={(e) =>
                                                        setVoucher_price_selectedId(e.target.value)
                                                    }
                                                    type="select"
                                                    options={[
                                                        { label:'No voucher', value: 'blank'},
                                                        ...temp_voucher
                                                        .filter((data) =>
                                                            data.voucher?.discount_type === 'discount_amount' ||
                                                            data.voucher?.discount_type === 'discount_percentage'
                                                        )
                                                        .map((data) => ({
                                                            label: data.voucher.code,
                                                            value: data.id
                                                        }))
                                                    ]}
                                                    disabled={crud == 'edit'}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between border-t border-border pt-2 font-semibold text-base">
                                            <span>Final Price</span>
                                            <span className="text-success">RM {booking.price_final}</span>
                                        </div>
                                    </div>
                            </Card>

                            {/* 4) Duration */}
                            <Card>
                                <label className="block mb-2 text-md font-medium text-title"> Duration </label>
                                
                                    {/* Price */}
                                    <div className="flex flex-col gap-2 text-sm border border-border p-3 rounded-xl">
                                        <div className="flex justify-between">
                                            <span className="text-title">Total Duration</span>
                                            <span>{temp_duration.original} minute</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-title">Extend time</span>
                                            <span className="text-success">+ {temp_duration.extended} minute</span>
                                        </div>

                                        <div className="grid cols-1 md:grid-cols-5 gap-5 items-center">
                                            <div className="col-span-3">
                                                <span className="text-title">Apply voucher</span>
                                            </div>

                                            <div className="col-span-2">
                                                <Field
                                                    value={voucher_duration_selectedId}
                                                    onChange={(e) =>
                                                        setVoucher_duration_selectedId(e.target.value)
                                                    }
                                                    type="select"
                                                    options={[
                                                        { label:'No voucher', value: 'blank'},
                                                        ...temp_voucher
                                                        .filter((data) => data.voucher?.discount_type === 'time_extension')
                                                        .map((data) => ({
                                                            label: data.voucher.code,
                                                            value: data.id
                                                        }))
                                                    ]}
                                                    disabled={crud == 'edit'}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between border-t border-border pt-2 font-semibold text-base">
                                            <span>Final Duration</span>
                                            <span className="text-success">{temp_duration.final} minute</span>
                                        </div>
                                    </div>
                            </Card>

                            {/* 5) Schedule */}
                            <Card className="col-span-2">
                                <label className="block mb-2 text-md font-medium text-title"> Select Date, Time & Therapist </label>
                                
                                <div className="grid cols-1 md:grid-cols-4 gap-5">
                                    <div className="col-span-2">
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
                                    </div>
                                    <div className="col-span-1">
                                        <Field
                                            label="Time (start)"
                                            value={booking.time_start}
                                            onChange={(e) =>
                                                setBooking({
                                                    ...booking,
                                                    time_start: e.target.value,
                                                })
                                            }
                                            type="time"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <Field
                                            label="Time (end)"
                                            value={booking.time_end}
                                            type="time"
                                            disabled
                                        />
                                    </div>

                                    {(booking.time_start && booking.date_start) && (
                                        <>
                                            {spinner ? (
                                                <div className="col-span-2 flex items-center justify-center gap-2 py-6 bg-tertiary border-2 border-border rounded-2xl">
                                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-title">Checking availability...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="col-span-2">
                                                        <Field
                                                            label={`Available therapist ${new_therapist?.length == 0 ? '(no therapist available ❌)' : ''}`}
                                                            value={booking_selected.user_id}
                                                            onChange={(e) =>
                                                                setBooking_selected({
                                                                    ...booking_selected,
                                                                    user_id: Number(e.target.value),
                                                                })
                                                            }
                                                            type="select"
                                                            options={
                                                                new_therapist?.map((item: any) => ({
                                                                    label: `${item.name} --> ${item.specialty}`,
                                                                    value: item.id
                                                                }))
                                                            }
                                                        />
                                                    </div>

                                                    <div className="col-span-2">
                                                        <Field
                                                            label={`Available room ${new_room?.length == 0 ? '(no room available ❌)' : ''}`}
                                                            value={booking_selected.room_id}
                                                            onChange={(e) =>
                                                                setBooking_selected({
                                                                    ...booking_selected,
                                                                    room_id: Number(e.target.value),
                                                                })
                                                            }
                                                            type="select"
                                                            options={
                                                                new_room?.map((item: any) => ({
                                                                    label: `${item.name} --> ${item.description}`,
                                                                    value: item.id
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}

                                </div>
                            </Card>
                        </>
                    )}

                </div>
            </Form>
            
            {/* Form */} {/*Log*/}
            <Form title='Booking history' isOpen={form_log} onClose={() => setForm_log(false)} width="max-w-4xl">
                <Table fieldName={tableTitle_log} data={log} loading={spinner} />
            </Form>

            {/* Delete*/}
            <Alert
                open={isAlert}
                title={`${updatedType=='Payment'? 'Make Payment?' : `${updatedType} the Treatment?`} `}
                description="This action can't be undone."
                isLoading={isLoading}
                confirmLabel="Confirm"
                onCancel={() => setIs_alert(false)}
                onConfirm={() => {
                    // do your action here
                    handleUpdate_booking()
                }}
            />
        </>
    )
}

export default Bookings;