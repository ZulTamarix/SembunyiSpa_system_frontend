import { useCallback, useEffect, useState } from "react";
import Grid from "../../components/ui/Grid";
import type { Report_customer_type, Report_revenue_type, Report_room_type, Report_therapist_type, Report_treatment_type } from "../../interface/report";
import api from "../../api/axios";
import { Table, type Column } from "../../components/ui/Table";
import Chart_bar from "../../components/chart/BarChart";
import Chart_pie from "../../components/chart/PieChart";
import Chart_line from "../../components/chart/LineChart";
import Card from "../../components/ui/Card";
import { ArrowDown, ArrowRight } from "lucide-react";


const Reports: React.FC = () => {

    //#region 1) --> useState
        const [spinner, setSpinner] = useState(false)
        const [chart, setChart] = useState<'table' | 'bar' | 'pie' | 'line'>('table')
        const [report, setReport] = useState<'total' | 'date'>('total')
        const [date, setDate] = useState({
            start: new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString('en-CA'), // today
            end: new Date().toLocaleDateString('en-CA') // 7 day before
        });
    //#endregion


    //#region 3) --> method
        const handle_filter = () => {
            fetchDataReport_customer(date.start, date.end)
            fetchDataReport_treatment(date.start, date.end)
            fetchDataReport_therapist(date.start, date.end)
            fetchDataReport_room(date.start, date.end)
            fetchDataReport_revenue(date.start, date.end)
        }

    // #endregion


    //#region 4) --> database
    
        // a) customer
        const [databaseReport_customer, setdatabaseReport_customer] = useState<Report_customer_type[]>([])
        const fetchDataReport_customer = useCallback((start:string, end: string) => {

            // loading
            setSpinner(true)

            api.get(`/report`, {
                params: {
                    date_start: start,
                    date_end: end,
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
        // b) treatment
        const [databaseReport_treatment, setdatabaseReport_treatment] = useState<Report_treatment_type[]>([])
        const fetchDataReport_treatment = useCallback((start:string, end: string) => {

            // loading
            setSpinner(true)

            api.get(`/report`, {
                params: {
                    date_start: start,
                    date_end: end,
                    switch: 'treatment',
                }
            })
            .then((response) => {
                console.log('data = ',response.data)
                setdatabaseReport_treatment(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
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
        // d) room
        const [databaseReport_room, setdatabaseReport_room] = useState<Report_room_type[]>([])
        const fetchDataReport_room = useCallback((start:string, end: string) => {

            // loading
            setSpinner(true)

            api.get(`/report`, {
                params: {
                    date_start: start,
                    date_end: end,
                    switch: 'room',
                }
            })
            .then((response) => {
                // console.log('data = ',response.data)
                setdatabaseReport_room(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setSpinner(false)
            })
        }, [])
        // e) revenue
        const [databaseReport_revenue, setdatabaseReport_revenue] = useState<Report_revenue_type[]>([])
        const fetchDataReport_revenue = useCallback((start:string, end: string) => {

            // loading
            setSpinner(true)

            api.get(`/report`, {
                params: {
                    date_start: start,
                    date_end: end,
                    switch: 'revenue',
                }
            })
            .then((response) => {
                // console.log('data = ',response.data)
                setdatabaseReport_revenue(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setSpinner(false)
            })
        }, [])

        useEffect(() => {
            handle_filter()
        }, [])

        
        // tableTitle
        const tableTitleReport_customer: Column<Report_customer_type>[] = [
            {
                key: "0",
                header: "Date",
                mergeRows: true,
                render: () => (
                    <span className="flex flex-col gap-1 items-center">
                        {date.start}
                            <ArrowDown size={20}/>
                        {date.end}
                    </span>
                )
            },
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
                header: "Revenue",
                render: (row) => (
                    <span>{`RM${Number(row.price || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`}</span>
                )
            },
            {
                key: "4",
                header: "Total booking",
                align: 'center',
                render: (row) => (
                    <span>{row.total}</span>
                )
            }
        ];
        const tableTitleReport_treatment: Column<Report_treatment_type>[] = [
            {
                key: "0",
                header: "Date",
                mergeRows: true,
                render: () => (
                    <span className="flex flex-col gap-1 items-center">
                        {date.start}
                            <ArrowDown size={20}/>
                        {date.end}
                    </span>
                )
            },
            {
                key: "1",
                header: "Treatment",
                render: (row) => (
                    <span>{row.treatment}</span>
                )
            },
            {
                key: "2",
                header: "Category",
                render: (row) => (
                    <span>{row.category}</span>
                )
            },
            {
                key: "3",
                header: "Total booking",
                align: 'center',
                render: (row) => (
                    <span>{row.total}</span>
                )
            }
        ];
        const tableTitleReport_therapist: Column<Report_therapist_type>[] = [
            {
                key: "0",
                header: "Date",
                mergeRows: true,
                render: () => (
                    <span className="flex flex-col gap-1 items-center">
                        {date.start}
                            <ArrowDown size={20}/>
                        {date.end}
                    </span>
                )
            },
            {
                key: "1",
                header: "Name",
                render: (row) => (
                    <span>{row.name}</span>
                )
            },    
            {
                key: "2",
                header: "Specialty",
                render: (row) => (
                    <span>{row.specialty}</span>
                )
            },
            {
                key: "3",
                header: "Total booking",
                align: 'center',
                render: (row) => (
                    <span>{row.total}</span>
                )
            }
        ];
        const tableTitleReport_room: Column<Report_room_type>[] = [
            {
                key: "0",
                header: "Date",
                mergeRows: true,
                render: () => (
                    <span className="flex flex-col gap-1 items-center">
                        {date.start}
                            <ArrowDown size={20}/>
                        {date.end}
                    </span>
                )
            },
            {
                key: "1",
                header: "Room",
                render: (row) => (
                    <span>{row.room}</span>
                )
            },    
            {
                key: "2",
                header: "Room",
                render: (row) => (
                    <span>{row.description}</span>
                )
            },
            {
                key: "3",
                header: "Total booking",
                align: 'center',
                render: (row) => (
                    <span>{row.total}</span>
                )
            }
        ];
        const tableTitleReport_revenue: Column<Report_revenue_type>[] = [
            {
                key: "1",
                header: "Date",
                render: (row) => (
                    <span>{row.date.split('-').reverse().join('-')}</span>
                )
            },   
            {
                key: "2",
                header: "Revenue",
                render: (row) => (
                    <>
                        {row.price != 0 ? (
                            <span>{`RM${Number(row.price || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`}</span>
                        ) : (
                            <span> - </span>
                        )}
                    </>
                )
            },
        ];

    //#endregion


    return (
        <>
            {/* Filter */}
            <Grid className="md:grid-cols-5 items-center">
                <div className="md:col-span-5 bg-white p-3 rounded-xl flex flex-wrap items-center justify-between gap-4 border border-border overflow-hidden">

                    {/* a) Left filters */}
                    <div className="flex items-center gap-3">
                        {/* chart */}
                        <select value={chart} onChange={(e) => setChart(e.target.value as 'table' | 'bar' | 'pie' | 'line')} className="bg-tertiary w-50 px-3 h-10 rounded-xl border border-border focus:outline-none focus:ring-0 focus:border-border">
                            <option value="" disabled>Select chart type</option>
                            <option value="table">Table</option>
                            <option value="bar">Bar chart</option>
                            <option value="pie">Pie chart</option>
                            <option value="line">Line chart</option>
                        </select>

                        {/* type */}
                        <select value={report} onChange={(e) => setReport(e.target.value as 'total' | 'date')} className="bg-tertiary w-50 px-3 h-10 rounded-xl border border-border focus:outline-none focus:ring-0 focus:border-border">
                            <option value="" disabled>Select report type</option>
                            <option value="total">By booking</option>
                            <option value="date">By date</option>
                        </select>
                    </div>

                    {/* b) Right filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <input type="date" value={date.start} onChange={(e) => setDate({...date, start:(e.target.value)})} className="bg-tertiary px-3 h-10 rounded-xl border border-border focus:outline-none focus:ring-0 focus:border-border"/>

                        <span><ArrowRight size={20}/></span>

                        <input type="date" value={date.end} onChange={(e) => setDate({...date, end:(e.target.value)})} className="bg-tertiary px-3 h-10 rounded-xl border border-border focus:outline-none focus:ring-0 focus:border-border"/>

                        <button onClick={handle_filter} className={`bg-secondary text-black font-bold cursor-pointer px-5 h-10 rounded-xl transition ${spinner ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-1 cursor-pointer"}`}>
                            Filter
                        </button>
                    </div>

                </div>
            </Grid>

            {/* Data */}
            {spinner ? (
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
                    {/* By 'total booking' */}
                    {report == 'total' ? (
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
                    // By 'selected date'
                    report == 'date' ? (
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
            )}

        </>
    )
}

export default Reports;