import { useCallback, useEffect, useState } from "react";
import Grid from "../../components/ui/Grid";
import type { Report_booking_type, Report_customer_type, Report_therapist_type } from "../../interface/report";
import api from "../../api/axios";
import { Table, type Column } from "../../components/ui/Table";
import { ArrowRight, FileSpreadsheet, FileText } from "lucide-react";
import Searchbar from "../../components/ui/Searchbar";
import { generateExcel } from "../../components/export/excel.service";
// import Button from "../../components/ui/Button";
import { generatePDF_simple } from "../../components/export/pdf.service";


const Reports: React.FC = () => {

    //#region 1) --> useState
        const [spinner, setSpinner] = useState(false)
        // searchbar
        const [searchDatabase, setSearchDatabase] = useState('')
        // const [chart, setChart] = useState<'table' | 'bar' | 'pie' | 'line'>('table')
        // const [report, setReport] = useState<'booking' | 'revenue'>('booking')
        const [report, setReport] = useState<'customer' | 'booking' | 'therapist'>('customer')
        const [date, setDate] = useState({
            start: new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString('en-CA'), // today
            end: new Date().toLocaleDateString('en-CA') // 7 day before
        });
    //#endregion


    //#region 3) --> method
        // searcbar
        const handle_filter = () => {
            if (report == 'customer')
                fetchDataReport_customer()
            else if (report == 'therapist')
                fetchDataReport_therapist(date.start, date.end)
            else if (report == 'booking')
                fetchDataReport_booking(date.start, date.end)
        }
        // excel
        const handleExport_Excel = () => {
            if(report == 'customer')
                generateExcel('customer-report.xlsx', filteredCustomer);
            else if(report == 'booking')
                generateExcel('booking-report.xlsx', filteredBooking);
            else if(report == 'therapist')
                generateExcel('therapist-report.xlsx', filteredTherapist);
        }
        // pdf
        const handleExport_PDF = () => {
            
            if(report == 'customer') {

                const pdfTitle = [
                    { key: 'name', label: 'NAME' },
                    { key: 'phoneNo', label: 'PHONE NO' },
                    { key: 'email', label: 'EMAIL' },
                    // { key: 'membership', label: 'MEMBERSHIP' },
                    { key: 'membership_code', label: 'MEMBERSHIP CODE' },
                    // { key: 'voucher', label: 'VOUCHER' },
                    // { key: 'booking', label: 'BOOKING' },
                    { key: 'date_registration', label: 'DATE REGISTRATION' },
                ];
                generatePDF_simple(filteredCustomer, 'CUSTOMER REPORT', pdfTitle, 'landscape', 'A4');
            }
            else if(report == 'booking') {
                const pdfTitle = [
                    { key: 'date', label: 'DATE' },
                    { key: 'time', label: 'TIME' },
                    { key: 'customer', label: 'CUSTOMER' },
                    { key: 'treatment', label: 'TREATMENT' },
                    { key: 'status', label: 'STATUS' },
                    { key: 'payment', label: 'PAYMENT' },
                    { key: 'quotation', label: 'QUOTATION' },
                ];
                generatePDF_simple(filteredBooking, 'BOOKING REPORT', pdfTitle, 'landscape', 'A4');
            }
            else if(report == 'therapist') {
                const pdfTitle = [
                    { key: 'date', label: 'DATE' },
                    { key: 'name', label: 'NAME' },
                    { key: 'specialty', label: 'SPECIALTY' },
                    { key: 'icon', label: 'ICON' },
                    { key: 'shift', label: 'SHIFT' },
                ];
                generatePDF_simple(filteredTherapist, 'THERAPIST REPORT', pdfTitle, 'landscape', 'A4');
            }
        }

    // #endregion


    //#region 4a) (KIV) --> database
    
    //     // a) customer
    //     const [databaseReport_customer, setdatabaseReport_customer] = useState<Report_customer_type[]>([])
    //     const fetchDataReport_customer = useCallback((start:string, end: string) => {

    //         // loading
    //         setSpinner(true)

    //         api.get(`/report`, {
    //             params: {
    //                 date_start: start,
    //                 date_end: end,
    //                 switch: 'customer',
    //             }
    //         })
    //         .then((response) => {
    //             console.log('data = ',response.data)
    //             setdatabaseReport_customer(response.data)
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching data:', error);
    //         })
    //         .finally(() => {
    //             setSpinner(false)
    //         })
    //     }, [])
    //     // b) treatment
    //     const [databaseReport_treatment, setdatabaseReport_treatment] = useState<Report_treatment_type[]>([])
    //     const fetchDataReport_treatment = useCallback((start:string, end: string) => {

    //         // loading
    //         setSpinner(true)

    //         api.get(`/report`, {
    //             params: {
    //                 date_start: start,
    //                 date_end: end,
    //                 switch: 'treatment',
    //             }
    //         })
    //         .then((response) => {
    //             console.log('data = ',response.data)
    //             setdatabaseReport_treatment(response.data)
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching data:', error);
    //         })
    //         .finally(() => {
    //             setSpinner(false)
    //         })
    //     }, [])
    //     // c) therapist
    //     const [databaseReport_therapist, setdatabaseReport_therapist] = useState<Report_therapist_type[]>([])
    //     const fetchDataReport_therapist = useCallback((start:string, end: string) => {

    //         // loading
    //         setSpinner(true)

    //         api.get(`/report`, {
    //             params: {
    //                 date_start: start,
    //                 date_end: end,
    //                 switch: 'therapist',
    //             }
    //         })
    //         .then((response) => {
    //             // console.log('data = ',response.data)
    //             setdatabaseReport_therapist(response.data)
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching data:', error);
    //         })
    //         .finally(() => {
    //             setSpinner(false)
    //         })
    //     }, [])
    //     // d) room
    //     const [databaseReport_room, setdatabaseReport_room] = useState<Report_room_type[]>([])
    //     const fetchDataReport_room = useCallback((start:string, end: string) => {

    //         // loading
    //         setSpinner(true)

    //         api.get(`/report`, {
    //             params: {
    //                 date_start: start,
    //                 date_end: end,
    //                 switch: 'room',
    //             }
    //         })
    //         .then((response) => {
    //             // console.log('data = ',response.data)
    //             setdatabaseReport_room(response.data)
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching data:', error);
    //         })
    //         .finally(() => {
    //             setSpinner(false)
    //         })
    //     }, [])
    //     // e) revenue
    //     const [databaseReport_revenue, setdatabaseReport_revenue] = useState<Report_revenue_type[]>([])
    //     const fetchDataReport_revenue = useCallback((start:string, end: string) => {

    //         // loading
    //         setSpinner(true)

    //         api.get(`/report`, {
    //             params: {
    //                 date_start: start,
    //                 date_end: end,
    //                 switch: 'revenue',
    //             }
    //         })
    //         .then((response) => {
    //             // console.log('data = ',response.data)
    //             setdatabaseReport_revenue(response.data)
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching data:', error);
    //         })
    //         .finally(() => {
    //             setSpinner(false)
    //         })
    //     }, [])

    //     useEffect(() => {
    //         handle_filter()
    //     }, [])
        
    //     // tableTitle
    //     const tableTitleReport_customer: Column<Report_customer_type>[] = [
    //         {
    //             key: "0",
    //             header: "Date",
    //             align: "center",
    //             mergeRows: true,
    //             render: () => (
    //                 <span className="flex flex-col gap-1 items-center">
    //                     {date.start}
    //                         <ArrowDown size={20}/>
    //                     {date.end}
    //                 </span>
    //             )
    //         },
    //         {
    //             key: "1",
    //             header: "Customer",
    //             render: (row) => (
    //                 <span>{row.name}</span>
    //             )
    //         },
    //         {
    //             key: "2",
    //             header: "Phone number",
    //             render: (row) => (
    //                 <span>{row.phoneNo}</span>
    //             )
    //         },
    //         {
    //             key: "3",
    //             header: "Revenue",
    //             render: (row) => (
    //                 <span>{`RM${Number(row.price || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`}</span>
    //             )
    //         },
    //         {
    //             key: "4",
    //             header: "Total booking",
    //             align: 'center',
    //             render: (row) => (
    //                 <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">{row.total}</span>
    //             )
    //         }
    //     ];
    //     const tableTitleReport_treatment: Column<Report_treatment_type>[] = [
    //         {
    //             key: "0",
    //             header: "Date",
    //             mergeRows: true,
    //             render: () => (
    //                 <span className="flex flex-col gap-1 items-center">
    //                     {date.start}
    //                         <ArrowDown size={20}/>
    //                     {date.end}
    //                 </span>
    //             )
    //         },
    //         {
    //             key: "1",
    //             header: "Treatment",
    //             render: (row) => (
    //                 <span>{row.treatment}</span>
    //             )
    //         },
    //         {
    //             key: "2",
    //             header: "Category",
    //             render: (row) => (
    //                 <span>{row.category}</span>
    //             )
    //         },
    //         {
    //             key: "3",
    //             header: "Total booking",
    //             align: 'center',
    //             render: (row) => (
    //                 <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">{row.total}</span>
    //             )
    //         }
    //     ];
    //     const tableTitleReport_therapist: Column<Report_therapist_type>[] = [
    //         {
    //             key: "0",
    //             header: "Date",
    //             mergeRows: true,
    //             render: () => (
    //                 <span className="flex flex-col gap-1 items-center">
    //                     {date.start}
    //                         <ArrowDown size={20}/>
    //                     {date.end}
    //                 </span>
    //             )
    //         },
    //         {
    //             key: "1",
    //             header: "Name",
    //             render: (row) => (
    //                 <span>{row.name}</span>
    //             )
    //         },    
    //         {
    //             key: "2",
    //             header: "Specialty",
    //             render: (row) => (
    //                 <span>{row.specialty}</span>
    //             )
    //         },
    //         {
    //             key: "3",
    //             header: "Total booking",
    //             align: 'center',
    //             render: (row) => (
    //                 <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">{row.total}</span>
    //             )
    //         }
    //     ];
    //     const tableTitleReport_room: Column<Report_room_type>[] = [
    //         {
    //             key: "0",
    //             header: "Date",
    //             mergeRows: true,
    //             render: () => (
    //                 <span className="flex flex-col gap-1 items-center">
    //                     {date.start}
    //                         <ArrowDown size={20}/>
    //                     {date.end}
    //                 </span>
    //             )
    //         },
    //         {
    //             key: "1",
    //             header: "Room",
    //             render: (row) => (
    //                 <span>{row.room}</span>
    //             )
    //         },    
    //         {
    //             key: "2",
    //             header: "Room",
    //             render: (row) => (
    //                 <span>{row.description}</span>
    //             )
    //         },
    //         {
    //             key: "3",
    //             header: "Total booking",
    //             align: 'center',
    //             render: (row) => (
    //                 <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">{row.total}</span>
    //             )
    //         }
    //     ];
    //     const tableTitleReport_revenue: Column<Report_revenue_type>[] = [
    //         {
    //             key: "1",
    //             header: "Date",
    //             render: (row) => (
    //                 <span>{row.date.split('-').reverse().join('-')}</span>
    //             )
    //         },   
    //         {
    //             key: "2",
    //             header: "Revenue",
    //             render: (row) => (
    //                 <>
    //                     {row.price != 0 ? (
    //                         <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">{`RM${Number(row.price || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`}</span>
    //                     ) : (
    //                         <span> - </span>
    //                     )}
    //                 </>
    //             )
    //         },
    //     ];

    //#endregion


    //#region 4b) --> database

        // a) customer
        const [databaseReport_customer, setdatabaseReport_customer] = useState<Report_customer_type[]>([])
        const fetchDataReport_customer = useCallback(() => {

            // loading
            setSpinner(true)

            api.get(`/report`, {
                params: {
                    switch: 'customer',
                }
            })
            .then((response) => {
                // console.log('data = ',response.data)
                setdatabaseReport_customer(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setSpinner(false)
            })
        }, [])

        // b) booking
        const [databaseReport_booking, setdatabaseReport_booking] = useState<Report_booking_type[]>([])
        const fetchDataReport_booking = useCallback((start:string, end: string) => {

            // loading
            setSpinner(true)

            api.get(`/report`, {
                params: {
                    date_start: start,
                    date_end: end,
                    switch: 'booking',
                }
            })
            .then((response) => {
                console.log('data = ',response.data)
                setdatabaseReport_booking(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error.response.data);
            })
            .finally(() => {
                setSpinner(false)
            })
        }, [])

        // c) therapist
        const [databaseReport_therapist, setdatabaseReport_therapist] = useState<Report_therapist_type[]>([])
        const fetchDataReport_therapist = useCallback((start:string, end: string) => {

            // loading
            setSpinner(true)

            api.get(`/report`, {
                params: {
                    date_start: start,
                    date_end: end,
                    switch: 'therapist',
                }
            })
            .then((response) => {
                // console.log('data = ',response.data)
                setdatabaseReport_therapist(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setSpinner(false)
            })
        }, [])
        
        useEffect(() => {
            if (report == 'customer')
                fetchDataReport_customer()
            else if (report == 'therapist')
                fetchDataReport_therapist(date.start, date.end)
            else if (report == 'booking')
                fetchDataReport_booking(date.start, date.end)
        }, [report])

        // tableTitle
        const tableTitleReport_customer: Column<Report_customer_type>[] = [
            {
                key: "1",
                header: "Customer",
                render: (row) => (
                    <span>{row.name}</span>
                )
            },
            {
                key: "2",
                header: "Phone number",
                render: (row) => (
                    <span>{row.phoneNo}</span>
                )
            },
            {
                key: "3",
                header: "email",
                render: (row) => (
                    <span>{row.email}</span>
                )
            },
            {
                key: "4",
                header: "Membership",
                align: "center",
                render: (row) => (
                    <>
                        {row.membership ? (
                            <span>{row.membership} ({row.membership_code})</span>
                        ) : (
                            <span>-</span>
                        )}
                    </>
                )
            },
            {
                key: "5",
                header: "Voucher",
                align: "center",
                render: (row) => (
                    <>
                        {row.voucher !='-' ? (
                            <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">{row.voucher}</span>
                        ) : (
                            <span>-</span>
                        )}
                    </>
                )
            },
            {
                key: "6",
                header: "Booking",
                align: "center",
                render: (row) => (
                    <>
                        {row.booking !='-' ? (
                            <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">{row.booking}</span>
                        ) : (
                            <span>-</span>
                        )}
                    </>
                )
            },
            {
                key: "7",
                header: "Registration date",
                render: (row) => (
                    <span>{row.date_registration}</span>
                )
            },
        ];
        const tableTitleReport_booking: Column<Report_booking_type>[] = [
            {
                key: "0",
                header: "Date",
                render: (row) => (
                    <span>{row.date.split('-').reverse().join('-')}</span>
                )
            },  
            {
                key: "1",
                header: "Customer",
                render: (row) => (
                    <span>{row.customer}</span>
                )
            },
            {
                key: "2",
                header: "Treatment",
                render: (row) => (
                    <span>{row.treatment}</span>
                )
            },
            {
                key: "3",
                header: "Booking status",
                render: (row) => (
                    <>
                        {row.status == 'pending'? (                            
                            <span className="py-1 px-2 rounded-full bg-amber-100 text-amber-600">Pending</span>
                        ) : 
                        row.status == 'booked'? (
                            <span className="py-1 px-2 rounded-full bg-amber-100 text-amber-600">Booked</span>
                        ) : 
                        row.status == 'in_treatment' ? (
                            <span className="py-1 px-2 rounded-full bg-amber-100 text-amber-600">In treatment</span>
                        ) : 
                        row.status == 'completed' ? (
                            <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">Completed</span>
                        ): 
                        row.status == 'cancel' ? (
                            <span className="py-1 px-2 rounded-full bg-red-100 text-red-600">Cancel</span>
                        ) : (
                            <>
                            </>
                        )}
                    </>
                )
            },
            {
                key: "4",
                header: "Payment status",
                render: (row) => (
                    <>
                    
                        {row.payment == 'paid' ? (
                            <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">Paid</span>
                        ) : 
                        row.payment == 'pending' ? (                            
                            <span className="py-1 px-2 rounded-full bg-red-100 text-red-600">Pending</span>
                        ): 
                        row.payment == 'cancel' ? (
                            <span className="py-1 px-2 rounded-full bg-red-100 text-red-600">Cancel</span>
                        ) : (
                            <>
                            </>
                        )}
                    </>
                )
            },
            {
                key: "5",
                header: "Quotation",
                render: (row) => (
                    <span>{row.quotation}</span>
                )
            },
        ];
        const tableTitleReport_therapist: Column<Report_therapist_type>[] = [
            {
                key: "1",
                header: "Date",
                render: (row) => (
                    <span>{row.date.split('-').reverse().join('-')}</span>
                )
            },
            {
                key: "2",
                header: "Name",
                render: (row) => (
                    <span>{row.name}</span>
                )
            },
            {
                key: "3",
                header: "Specialty",
                render: (row) => (
                    <span>{row.specialty}</span>
                )
            },
            {
                key: "4",
                header: "Icon",
                render: (row) => (
                    <span>{row.icon}</span>
                )
            },
            {
                key: "5",
                header: "Shift",
                render: (row) => (
                    <span>{row.shift}</span>
                )
            },
        ];

    //#endregion

    
    //#region 5) --> searchbar
        const filteredCustomer = databaseReport_customer.filter((data) => {
            const search = searchDatabase.toLowerCase().trim()

            return (
                data.name?.toLowerCase().includes(search) ||
                data.phoneNo?.toLowerCase().includes(search) ||
                data.email?.toLowerCase().includes(search) ||
                data.membership?.toLowerCase().includes(search) ||
                data.membership_code?.toLowerCase().includes(search)
            )
        })
        const filteredBooking = databaseReport_booking.filter((data) => {
            const search = searchDatabase.toLowerCase().trim()

            return (
                data.date?.toLowerCase().includes(search) ||
                data.time?.toLowerCase().includes(search) ||
                data.customer?.toLowerCase().includes(search) ||
                data.treatment?.toLowerCase().includes(search) ||
                data.status?.toLowerCase().includes(search) ||
                data.payment?.toLowerCase().includes(search) ||
                data.quotation?.toLowerCase().includes(search)
            )
        })
        const filteredTherapist = databaseReport_therapist.filter((data) => {
            const search = searchDatabase.toLowerCase().trim()

            return (
                data.date?.toLowerCase().includes(search) ||
                data.name?.toLowerCase().includes(search) ||
                data.specialty?.toLowerCase().includes(search) ||
                String(data.icon ?? '').toLowerCase().includes(search) ||
                data.shift?.toLowerCase().includes(search) 
            )
        })
    //#endregion


    return (
        <>
            {/* Filter */}
            <Grid className="md:grid-cols-5 items-center">
                <div className="md:col-span-5 bg-white p-3 rounded-xl flex flex-wrap items-center justify-between gap-4 border border-border overflow-hidden">

                    {/* a) Left filters */}
                    <div className="flex items-center gap-3">
                        <Searchbar value={searchDatabase} onChange={(e: any) => setSearchDatabase(e.target.value)} placeholder="Search by name, phone number, or treatment" className="md:col-span-2 bg-tertiary "/>

                        {/* type */}
                        <select value={report} onChange={(e) => setReport(e.target.value as 'customer' | 'booking' | 'therapist')} className="bg-tertiary w-50 px-3 h-10 rounded-xl border border-border focus:outline-none focus:ring-0 focus:border-border">
                            <option value="" disabled>Select report type</option>
                            <option value="customer">Customer</option>
                            <option value="booking">Booking</option>
                            <option value="therapist">Therapist</option>
                        </select>
                        
                        {/* Export Excel */}
                        <button onClick={handleExport_Excel} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 h-10 rounded-xl transition cursor-pointer">
                            <FileSpreadsheet size={18} />
                            Excel
                        </button>

                        {/* Export PDF */}
                        <button onClick={handleExport_PDF} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 h-10 rounded-xl transition cursor-pointer">
                            <FileText size={18} />
                            PDF
                        </button>
                    </div>

                    {/* b) center */}
                  

                    {/* c) Right filters */}
                    {report != 'customer' && (
                        <div className="flex flex-wrap items-center gap-2">
                            <input type="date" value={date.start} onChange={(e) => setDate({...date, start:(e.target.value)})} className="bg-tertiary px-3 h-10 rounded-xl border border-border focus:outline-none focus:ring-0 focus:border-border"/>

                            <span><ArrowRight size={20}/></span>

                            <input type="date" value={date.end} onChange={(e) => setDate({...date, end:(e.target.value)})} className="bg-tertiary px-3 h-10 rounded-xl border border-border focus:outline-none focus:ring-0 focus:border-border"/>

                            <button onClick={handle_filter} className={`bg-secondary text-black font-bold cursor-pointer px-5 h-10 rounded-xl transition ${spinner ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-1 cursor-pointer"}`}>
                                Filter
                            </button>
                        </div>
                    )}

                </div>
            </Grid>

            {/* Data */} {/* {KIV} */}
            {/* {spinner ? (
                <>
                    <Grid>
                        <Card>
                            <div className="w-full h-75 flex flex-col items-center justify-center gap-3 bg-white">
                                <div className="w-8 h-8 border-4 border-border border-t-secondary rounded-full animate-spin" />
                                <p className="text-sm text-title">Generating data...</p>
                            </div>
                        </Card>
                    </Grid>
                </>
            ) : (
                <>
                    {report == 'booking' ? (
                        <>
                            {chart == 'table' ? (
                                <Grid>
                                    <Table title="Customer"     fieldName={tableTitleReport_customer}   data={databaseReport_customer} loading={spinner} />
                                    <Table title="Treatment"    fieldName={tableTitleReport_treatment}  data={databaseReport_treatment} loading={spinner} />
                                    <Table title="Therapist"    fieldName={tableTitleReport_therapist}  data={databaseReport_therapist} loading={spinner} />
                                    <Table title="Room"         fieldName={tableTitleReport_room}       data={databaseReport_room} loading={spinner} />
                                </Grid>
                            ) : 
                            chart == 'bar' ? (
                                <Grid className="md:grid-cols-2">
                                    <Chart_bar
                                        title="Customer Distribution"
                                        data={databaseReport_customer}
                                        xKey="name"
                                        yKey="total"
                                        xLabel="Customer Name"
                                        yLabel="Total Bookings"
                                        spinner={spinner}
                                    />

                                    <Chart_bar
                                        title="Treatment Distribution"
                                        data={databaseReport_treatment}
                                        xKey="treatment"
                                        yKey="total"
                                        xLabel="Treatment Name"
                                        yLabel="Total Bookings"
                                        spinner={spinner}
                                    />

                                    <Chart_bar
                                        title="Therapist Distribution"
                                        data={databaseReport_therapist}
                                        xKey="name"
                                        yKey="total"
                                        xLabel="Therapist Name"
                                        yLabel="Total Bookings"
                                        spinner={spinner}
                                    />

                                    <Chart_bar
                                        title="Room Distribution"
                                        data={databaseReport_room}
                                        xKey="room"
                                        yKey="total"
                                        xLabel="Room Name"
                                        yLabel="Total Bookings"
                                        spinner={spinner}
                                    />
                                </Grid>
                            ) : 
                            chart == 'pie' ? (
                                <Grid className="md:grid-cols-2">
                                    <Chart_pie
                                        title="Customer Distribution"
                                        data={databaseReport_customer}
                                        xKey="name"
                                        yKey="total"
                                        spinner={spinner}
                                    />
                                    <Chart_pie
                                        title="Treatment Distribution"
                                        data={databaseReport_treatment}
                                        xKey="treatment"
                                        yKey="total"
                                        spinner={spinner}
                                    />
                                    <Chart_pie
                                        title="Therapist Distribution"
                                        data={databaseReport_therapist}
                                        xKey="name"
                                        yKey="total"
                                        spinner={spinner}
                                    />
                                    <Chart_pie
                                        title="Room Distribution"
                                        data={databaseReport_room}
                                        xKey="room"
                                        yKey="total"
                                        spinner={spinner}
                                    />
                                </Grid>
                            ) : 
                            chart == 'line' ? (
                                <Grid className="md:grid-cols-2">
                                    <Chart_line
                                        title="Customer Distribution"
                                        data={databaseReport_customer}
                                        xKey="name"
                                        yKey="total"
                                        xLabel="Customer Name"
                                        yLabel="Total Bookings"
                                        spinner={spinner}
                                    />
                                    <Chart_line
                                        title="Treatment Distribution"
                                        data={databaseReport_treatment}
                                        xKey="treatment"
                                        yKey="total"
                                        xLabel="Treatment Name"
                                        yLabel="Total Bookings"
                                        spinner={spinner}
                                    />
                                    <Chart_line
                                        title="Therapist Distribution"
                                        data={databaseReport_therapist}
                                        xKey="name"
                                        yKey="total"
                                        xLabel="Therapist Name"
                                        yLabel="Total Bookings"
                                        spinner={spinner}
                                    />
                                    <Chart_line
                                        title="Room Distribution"
                                        data={databaseReport_room}
                                        xKey="room"
                                        yKey="total"
                                        xLabel="Room Name"
                                        yLabel="Total Bookings"
                                        spinner={spinner}
                                    />
                                </Grid>
                            ) : (
                                <>
                                </>
                            )}
                        </>
                    ) : 
                    report == 'revenue' ? (
                        <>
                            {chart == 'table' ? (
                                <Grid>
                                    <Table title="Revenue" fieldName={tableTitleReport_revenue} data={databaseReport_revenue} loading={spinner} />
                                </Grid>
                            ) : 
                            chart == 'bar' ? (
                                <Grid className="md:grid-cols-1">
                                    <Chart_bar
                                        title="Monthly Booking Trend"
                                        data={databaseReport_revenue}
                                        xKey="date"
                                        yKey="price"
                                        xLabel="Date"
                                        yLabel="Total Revenue (RM)"
                                        spinner={spinner}
                                    />
                                </Grid>
                            ) : 
                            chart == 'pie' ? (
                                <Grid>
                                    <Chart_pie
                                        title="Monthly Booking Trend"
                                        data={databaseReport_revenue}
                                        xKey="date"
                                        yKey="price"
                                        spinner={spinner}
                                    />
                                </Grid>
                            ) : 
                            chart == 'line' ? (
                                <Grid>
                                    <Chart_line
                                        title="Monthly Booking Trend"
                                        data={databaseReport_revenue}
                                        xKey="date"
                                        yKey="price"
                                        xLabel="Date"
                                        yLabel="Total Revenue (RM)"
                                        spinner={spinner}
                                    />
                                </Grid>
                            ) : (
                                <>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                        </>
                    )}
                </>
            )} */}

            {report == 'customer' ? (
                <Grid>
                    {/* <Table fieldName={tableTitleReport_customer} data={databaseReport_customer} loading={spinner} /> */}
                    <Table fieldName={tableTitleReport_customer} data={filteredCustomer} loading={spinner} />
                </Grid>
            ) : 
            report == 'booking' ? (
                <Grid>
                    {/* <Table fieldName={tableTitleReport_booking} data={databaseReport_booking} loading={spinner} /> */}
                    <Table fieldName={tableTitleReport_booking} data={filteredBooking} loading={spinner} />
                </Grid>
            ) : 
            report == 'therapist' ? (
                <Grid>
                    {/* <Table fieldName={tableTitleReport_therapist} data={databaseReport_therapist} loading={spinner} /> */}
                    <Table fieldName={tableTitleReport_therapist} data={filteredTherapist} loading={spinner} />
                </Grid>
            ) : (
                <>
                </>
            )}

        </>
    )
}

export default Reports;