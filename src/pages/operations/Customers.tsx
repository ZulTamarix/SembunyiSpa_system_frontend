import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Table, { type Column } from "../../components/ui/Table";
import Searchbar from "../../components/ui/Searchbar";
import roster from "../../JSON/roster.json";
import type { User_type } from "../../interface/user";
import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";
import Label from "../../components/ui/Label";

const Customers: React.FC = () => {

    // #region 1) database
    
        const [databaseUser, setDatabase_user] = useState<User_type[]>([])
        const fetchData_user = useCallback(() => {

            api.get('/user', {
                params: {
                    role: 'customer',
                    extra: 'include walk in'
                }
            })
            .then((response) => {
                console.log('data = ',response.data)
                setDatabase_user(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }, [])

        // fetch database
        useEffect(() => {
            fetchData_user()
        }, [])

        // tableTitle
        const tableTitle: Column<User_type>[] = [
            {
                key: "customer",
                header: "Customer",
                render: (row) => (
                    <div className="flex items-center gap-3 whitespace-nowrap">
                        <span className="font-bold text-secondary w-8 h-8 bg-tertiary rounded-full flex items-center justify-center">
                            {row.name.charAt(0)}
                        </span>

                        <span className="font-semibold text-black">
                            {row.name}
                        </span>
                    </div>
                )
            },
            {
                key: "phoneNo",
                header: "Phone Number",
                render: (row) => row.phoneNo
            },
            {
                key: "email",
                header: "Email",
                render: (row) => row.email
            },
            {
                key: "date joined",
                header: "Date Joined",
                render: (row) => row.date_joined
            },
            {
                key: "type",
                header: "type",
                render: (row) => (
                    <>
                        {row.role == 'customer' ? (
                            <span className="py-1 px-2 rounded-full bg-cyan-100 text-cyan-500">Customer</span>
                        ) : 
                        row.role == 'walkin' ? (
                            <span className="py-1 px-2 rounded-full bg-red-100 text-rose-400">Walkin</span>
                        ) : (
                            <span>-</span>
                        )} 
                    </>
                )
            },
            {
                key: "booking",
                header: "Booking",
                render: () => 0
            },
        ];

    //#endregion
    
    
    return (
        <>
            {/* filter */}
            <Grid className="md:grid-cols-7 items-center">
                <Searchbar placeholder="Search customers..." className="md:col-span-2 bg-white "/>
                <Button onClick={()=> console.log('data = ',roster)} icon={Plus} label='Add Customer' className="md:col-start-7 md:col-span-3"/>
            </Grid>

            {/* Create */}
            <Grid className="md:grid-cols-5 items-center">
                <Label>{databaseUser.length} Customer</Label>
            </Grid>

            {/* table */}
            <Grid>
                <Table fieldName={tableTitle} data={databaseUser} />
            </Grid>
        </>
    )
}

export default Customers;