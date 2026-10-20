import React, { useCallback, useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Grid from "../../components/ui/Grid";
import { getCurrentDate } from "../../utils/date";
import type { Roster_json } from "../../interface/roster";
import api from "../../api/axios";
import { Table, type Column } from "../../components/ui/Table";
import type { Booking_type } from "../../interface/booking";

const Dashboard: React.FC = () => {

    // 2) card style
    const titleStyle = "text-sm text-title font-semibold";
    const dataStyle = "text-3xl font-semibold font-serif";
    const infoStyle = "text-sm";

    //#region 1) --> useState
        // loading state
        const [spinner, setSpinner] = useState(false)

    //#endregion


    //#region 3) --> database

        // a) fetch 'roster'
        const [databaseRoster, setDatabase_roster] = useState<Roster_json[]>([])
        const fetchData_roster = useCallback(() => {

            // loading
            setSpinner(true)

            api.get(`/roster`, {
                params: {
                    switch: 'roster',
                    extra: 'currentDay',

                    currentDay: getCurrentDate()
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
        const fetchData_schedule = useCallback(() => {
            
            // loading
            setSpinner(true)

            api.get(`/booking`, {
                params: {
                    date: getCurrentDate(),
                    switch: 'therapist',
                    extra: 'currentDay'
                }
            })
            .then((response) => {
                // console.log('data = ',response.data)
                setDatabase_schedule(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error.data);
            })
            .finally(() => {
                setSpinner(false)
            })
        }, []);



        useEffect(() =>{
            fetchData_schedule();
            fetchData_roster()
        }, [])

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
        const tableTitle_schedule: Column<Booking_type>[] = [
            {
                key: "1",
                header: "Treatment",
                render: (row) => row.booking_selected?.package?.title || '-'
            },
            {
                key: "2",
                header: "Therapist",
                render: (row) => row.booking_selected?.user?.name || '-'
            },
            {
                key: "3",
                header: "Room",
                render: (row) => row.booking_selected?.room?.name || '-'
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

    //#endregion



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

            <Grid>
                <Table title="Roster" fieldName={tableTitle_roster} data={databaseRoster} loading={spinner} />
                <Table title="Schedule" fieldName={tableTitle_schedule} data={databaseSchedule} loading={spinner} />
            </Grid>
        </>
    )
}

export default Dashboard;