import Grid from "../../components/ui/Grid";
import Table, { type Column } from "../../components/ui/Table";
import Searchbar from "../../components/ui/Searchbar";
import type { User_type } from "../../interface/user";
import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";
import Label from "../../components/ui/Label";
import type { Voucher_type } from "../../interface/vouchers";
import Form from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";

const Customers: React.FC = () => {

    //#region 1) --> useState

        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // form
        const [form_voucher, setForm_voucher] = useState(false);
        // loading
        const [isLoading, setIsLoading] = useState(false);
        // fieldname
        const [selectedCustomer, setSelected_customer] = useState ({
            id: 0,
            name: ''
        })
        const [selectedVoucher, setSelected_voucher] = useState ({
            id: 0,
            quantity: 0
        })

    //#endregion


    //#region 2) --> database
    
        const [databaseUser, setDatabase_user] = useState<User_type[]>([])
        const [databaseVoucher, setDatabase_voucher] = useState<Voucher_type[]>([])
        
        // customer
        const fetchData_user = useCallback(() => {

            api.get(`/user`, {
                params: {
                    role: 'customer',
                    extra_1: 'include walk in',
                    extra_2: 'include voucher'
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
        // voucher
        const fetchData_voucher = useCallback(() => {
            api.get(`/voucher`, {
                params :{
                    extra: 'exclude inactive'
                }
            })
            .then((response) => {
                // console.log('data = ',response.data)
                setDatabase_voucher(response.data)
                
                // set data
                setSelected_voucher(({
                    id: response.data[0].id,
                    quantity: response.data[0].quantity
                }))
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }, [])

        useEffect(() => {
            fetchData_user()
            fetchData_voucher()
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
                align: "center",
                render: () => 0
            },
            {
                key: "voucher",
                header: "Voucher",
                align: "center",
                render: (row) => (
                    <>
                        {row.role == 'customer' ? (
                            <span>{row.voucher_customers?.length}</span>

                        ) : (
                            <span>-</span>
                        )}
                    </>
                )
            },
            {
                key: "add_voucher",
                header: "Add voucher",
                align: "center",
                render: (row) => (
                    <>
                        {row.role == 'customer' ? (
                            <button onClick={() => handleSelect_customer(row)} className="border border-border p-1 px-5 bg-secondary text-black cursor-pointer rounded-md">
                                <span className="font-bold">+</span>
                            </button>
                        ) : (
                            <span>-</span>
                        )}
                    </>
                )
            },
        ];

    //#endregion
    
    
    //#region 3) --> method
        const handleSelect_customer = (data: any) => {
            setSelected_customer({
                id: data.id,
                name: data.name
            }) 
            setForm_voucher(true)
        }
        // UPDATE
        const handleUpdate_voucher = async () => {

            // find index
            const selectedIndex = databaseVoucher.findIndex(
                (voucher) => voucher.id === selectedVoucher.id
            );
            // loading
            setIsLoading(true)
            try {
                await api.post(`/voucher`, {
                    user_id: selectedCustomer.id,
                    voucher_id: selectedVoucher.id,
                    quantity: databaseVoucher[selectedIndex].quantity,

                    switch: 'voucher_customer'
                });

                fetchData_user()
                setForm_voucher(false)
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
    
    
    return (
        <>
            {/* Filter */}
            <Grid className="md:grid-cols-7 items-center">
                <Searchbar placeholder="Search customers..." className="md:col-span-2 bg-white "/>
                {/* <Button icon={Plus} label='Add Customer' className="md:col-start-7 md:col-span-3"/> */}
            </Grid>

            {/* Create */}
            <Grid className="md:grid-cols-5 items-center">
                <Label>{databaseUser.length} Customer</Label>
            </Grid>

            {/* Table */}
            <Grid>
                <Table fieldName={tableTitle} data={databaseUser} />
            </Grid>

            
            {/* Form */}
            <Form title={crud=='create'? 'Add Voucher':'Edit Voucher'} isOpen={form_voucher} onClose={() => setForm_voucher(false)} width="max-w-md"
                
                footer={
                    <>
                        <Button
                            label="Cancel"
                            className="w-24"
                            onClick={() => setForm_voucher(false)}
                            disabled={isLoading}
                        />

                        {crud == 'create' ? (
                            <Button
                                label="Save"
                                className="w-24"
                                onClick={handleUpdate_voucher}
                                disabled={isLoading}
                            />
                        ) : (
                            <Button
                                label="Update"
                                className="w-24"
                                onClick={handleUpdate_voucher}
                                disabled={isLoading}
                            />
                        )}

                    </>
                }
            >
                <div className="space-y-4">
                    {/* 1) */}
                    <Field
                        label="Name"
                        value={selectedCustomer.name}
                        disabled
                    />
                    {/* 2) */}
                    <Field
                        label="Voucher"
                        // placeholder="Select role"
                        value={selectedVoucher.id}
                        onChange={(e) => setSelected_voucher({ ...selectedVoucher, id: Number(e.target.value)})}
                        type="select"
                        options={
                            databaseVoucher.map((voucher) => ({
                                label: voucher.code,
                                value: voucher.id
                            }))
                        }
                    />
                    {/* 3) */}
                    <Field
                        label="Description"
                        value={databaseVoucher[(selectedVoucher.id-1)]?.description || ''}
                        type="textarea"
                        disabled
                    />
                </div>
            </Form>
        </>
    )
}

export default Customers;