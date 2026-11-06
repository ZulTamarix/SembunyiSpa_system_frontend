import { useCallback, useEffect, useState } from "react";
import Grid from "../../components/ui/Grid";
import type { Report_customer_type, Report_room_type, Report_therapist_type, Report_treatment_type } from "../../interface/report";
import api from "../../api/axios";
import { Table, type Column } from "../../components/ui/Table";

const Reports: React.FC = () => {

    //#region 1) --> useState
        const [spinner, setSpinner] = useState(false)
    //#endregion


    //#region 4) --> database
    
        // a) customer
        const [databaseReport_customer, setdatabaseReport_customer] = useState<Report_customer_type[]>([])
        const fetchDataReport_customer = useCallback(() => {

            // loading
            setSpinner(true)

            api.get(`/report`, {
                params: {
                    date_start: '2026-11-01',
                    date_end: '2026-11-30',
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
        const fetchDataReport_treatment = useCallback(() => {

            // loading
            setSpinner(true)

            api.get(`/report`, {
                params: {
                    date_start: '2026-11-01',
                    date_end: '2026-11-30',
                    switch: 'treatment',
                }
            })
            .then((response) => {
                // console.log('data = ',response.data)
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
        const fetchDataReport_therapist = useCallback(() => {

            // loading
            setSpinner(true)

            api.get(`/report`, {
                params: {
                    date_start: '2026-11-01',
                    date_end: '2026-11-30',
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
        const fetchDataReport_room = useCallback(() => {

            // loading
            setSpinner(true)

            api.get(`/report`, {
                params: {
                    date_start: '2026-11-01',
                    date_end: '2026-11-30',
                    switch: 'room',
                }
            })
            .then((response) => {
                console.log('data = ',response.data)
                setdatabaseReport_room(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setSpinner(false)
            })
        }, [])

        useEffect(() => {
            fetchDataReport_customer()
            fetchDataReport_treatment()
            fetchDataReport_therapist()
            fetchDataReport_room()
        }, [])

        
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

    //#endregion

    return (
        <>
            {/* table */}
            <Grid>
                <Table title="Customer"     fieldName={tableTitleReport_customer}   data={databaseReport_customer} loading={spinner} />
                <Table title="Treatment"    fieldName={tableTitleReport_treatment}  data={databaseReport_treatment} loading={spinner} />
                <Table title="Therapist"    fieldName={tableTitleReport_therapist}  data={databaseReport_therapist} loading={spinner} />
                <Table title="Room"         fieldName={tableTitleReport_room}       data={databaseReport_room} loading={spinner} />
            </Grid>
        </>
    )
}

export default Reports;