import React, { useCallback, useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Grid from "../../components/ui/Grid";
import type { Roster_json } from "../../interface/roster";
import api from "../../api/axios";
import { Table, type Column } from "../../components/ui/Table";
import type { Booking_type } from "../../interface/booking";
import { getCurrentDate } from "../../utils/date";

// change date

const Dashboard: React.FC = () => {

    // 2) card style
    const titleStyle = "text-sm text-title font-semibold";
    const dataStyle = "text-3xl font-semibold";
    const infoStyle = "text-sm";


    //#region 1) --> useState
        const [spinner, setSpinner] = useState(false)
    //#endregion


    //#region 3) --> database

        // a) fetch 'roster'
        const [databaseRoster, setDatabase_roster] = useState<Roster_json[]>([])
        const fetchData_roster = useCallback((date: string) => {
            // loading
            setSpinner(true)

            api.get(`/roster`, {
                params: {
                    currentDay: date,
                   
                    switch: 'roster',
                    extra: 'currentDay',
                }
            })
            .then((response) => {
                // console.log('roster = ',response.data)
                setDatabase_roster(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error.data);
            })
            .finally(() => {
                setSpinner(false)
            })
        }, [])
        
        // b) fetch 'schedule'
        const [databaseSchedule, setDatabase_schedule] = useState<Booking_type[]>([])
        const fetchData_schedule = useCallback((date: string) => {
            // loading
            setSpinner(true)

            api.get(`/booking`, {
                params: {
                    date: date,

                    switch: 'dashboard'
                }
            })
            .then((response) => {
                response.data.sort((a:any, b:any) => {
                    const [aHour, aMinute] = a.time_start.split(":").map(Number);
                    const [bHour, bMinute] = b.time_start.split(":").map(Number);

                    return (aHour * 60 + aMinute) - (bHour * 60 + bMinute);
                });
                console.log('data = ',response.data)
                setDatabase_schedule(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error.data);
            })
            .finally(() => {
                setSpinner(false)
            })
        }, []);

        // c) fetch venue from booking
        
        const [databaseVenue, setDatabase_venue] = useState<any>([])
        const fetchData_venue = useCallback(() => {
            // loading
            setSpinner(true)
            
            // get 1st and last day of current month
            const today = new Date();
            const first = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('en-CA');
            const last = new Date(today.getFullYear(), today.getMonth() + 1, 0).toLocaleDateString('en-CA');

            api.get(`/booking`, {
                params: {
                    firstDate: first,
                    lastDate: last,

                    switch: 'venue'
                }
            })
            .then((response) => {
                console.log('data = ',response.data)
                setDatabase_venue(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error.data);
            })
            .finally(() => {
                setSpinner(false)
            })
        }, []);

        // tableTitle
        const tableTitle_roster: Column<Roster_json>[] = [
            {
                key: "1",
                header: "Therapist",
                render: (row) => row.roster.user?.name
            },
            {
                key: "2",
                header: "Specialty",
                render: (row) => row.roster.user?.specialty
            },
            {
                key: "3",
                header: "Shift",
                align: "center",
                render: (row) => {

                    // if has no shift
                    if (!row?.roster_shift?.time_start || !row?.roster_shift?.time_end) {
                        return (
                            <span className="py-1 px-2 rounded-full bg-red-100 text-red-600">
                                {row?.roster_leave?.description || '-'}
                            </span>
                        );
                    }
                    else {
                        const start = row.roster_shift.time_start.slice(0, 5).replace(/^0/, "");
                        const end = row.roster_shift.time_end.slice(0, 5).replace(/^0/, "");

                        return (
                            <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">
                                {start} - {end}
                            </span>
                        );
                    }
                }
            }
        ];
        const tableTitle_schedule: Column<any>[] = [
            {
                key: "1",
                header: "Treatment",
                render: (row) => row.package_id? row.package.title : row.booking_selected[0]?.package.title
            },
            {
                key: "2",
                header: "Therapist",
                render: (row) => row.booking_selected[0]?.user?.name
            },
            {
                key: "3",
                header: "Room",
                render: (row) => row.booking_selected[0]?.room?.name || '-'
            },
            {
                key: "4",
                header: "Time",
                render: (row) => {
                
                    const start = row.time_start.slice(0, 5).replace(/^0/, "");
                    const end = row.time_end.slice(0, 5).replace(/^0/, "");

                    return (
                        <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">
                            {start} - {end}
                        </span>
                    );
                }
            },
            // {
            //     key: "1",
            //     header: "",
            //     render: (row) => row.
            // },
            // {
            //     key: "1",
            //     header: "",
            //     render: (row) => row.
            // },
        ];

        useEffect(() => {
            fetchData_roster(getCurrentDate());
            fetchData_schedule(getCurrentDate());
            fetchData_venue();
        }, [])

    //#endregion


    return (
        <>
            {/* Info */}
            <Grid className="md:grid-cols-8">
                {[
                    { title: "Daily Revenue", value: `RM${Number(databaseVenue.daily_predict || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`, info: "↑ Predicted amount" },
                    { title: "Weekly Revenue", value: `RM${Number(databaseVenue.weekly_predict || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`, info: "↑ Predicted amount" },
                    { title: "Monthly Revenue", value: `RM${Number(databaseVenue.monthly_actual || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`, info: "↑ Actual amount" },
                    { title: "Upcoming customer", value: databaseSchedule.length, info: null },
                    { title: "Upcoming booking", value: databaseSchedule.length, info: null },
                ].map((item, i) => (
                    <div className={`${item.info? 'col-span-2' : 'col-span-1'}`}>
                        <Card key={i}>
                            <div className={`flex flex-col ${item.info? '' : 'text-center'}`}>
                                <span className={titleStyle}>{item.title}</span>

                                {/* {spinner ? (
                                    <div className="my-1 h-7 w-28 animate-pulse rounded-md bg-gray-200" />
                                ) : (
                                    <span className={dataStyle}>{item.value}</span>
                                )} */}
                                    <span className={dataStyle}>{item.value || '0'}</span>


                                {item.info && (
                                    <span className={`${infoStyle} text-green-700`}>
                                        {item.info}
                                    </span>
                                )}
                            </div>
                        </Card>
                    </div>
                ))}
            </Grid>

            <br/>
            
            {/* Table */}
            <Grid>
                <Table title="Roster" fieldName={tableTitle_roster} data={databaseRoster} loading={spinner} dateNavigation={true} onDateChange={(date) => fetchData_roster(date)}/>
                <Table title="Schedule" fieldName={tableTitle_schedule} data={databaseSchedule} loading={spinner} dateNavigation={true} onDateChange={(date) => fetchData_schedule(date)}/>
            </Grid>
        </>
    )
}

export default Dashboard;
