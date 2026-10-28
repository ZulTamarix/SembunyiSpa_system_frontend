import Grid from "../../components/ui/Grid";
import Table, { type Column } from "../../components/ui/Table";
import Searchbar from "../../components/ui/Searchbar";
import type { User_type } from "../../interface/user";
import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";
import Label from "../../components/ui/Label";
import type { Voucher_customer_type, Voucher_type } from "../../interface/vouchers";
import Form from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import { Eye, Plus, Timeline } from "lucide-react";
import { getCurrentDate, getCurrentDate_Add_OneYear } from "../../utils/date";
import type { Membership_json } from "../../interface/membership";
import Alert from "../../components/ui/Alert";
import type { Log_voucher_type } from "../../interface/log_voucher";

const Customers: React.FC = () => {

    //#region 1) --> useState

        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading state
        const [spinner, setSpinner] = useState(false)
        // selected id
        const [selectedId, setSelected_id] = useState(0);
        // a) detect error -> common
        const [isAlert, setIs_alert] = useState(false);
        // form
        const [form_user, setForm_user] = useState(false);
        const [form_voucher, setForm_voucher] = useState(false);
        const [form_membership, setForm_membership] = useState(false);
        const [form_voucherList, setForm_voucherList] = useState(false);
        const [form_log, setForm_log] = useState(false);
        // loading
        const [isLoading, setIsLoading] = useState(false);
        // fieldname
        const [log, setLog] = useState<Log_voucher_type[]> ([])
        const [selectedCustomer, setSelected_customer] = useState ({
            id: 0,
            name: ''
        })
        const [selectedVoucher, setSelected_voucher] = useState ({
            id: 0,
            quantity: 0
        })
        const [voucher, setVoucher] = useState<Voucher_customer_type[]>([])
        const [user, setUser] = useState<User_type>({
            id: 0,
            role: 'customer',
            name: '',
            email: '',
            phoneNo: '',
            status: '',
            password: '',
            specialty: '',
            code: ''
        })
        const [membership, setMembership] = useState<User_type> ({
            id: 0,
            role: '',
            name: '',
            email: '',
            phoneNo: '',
            status: '',
            password: '',
            membership_id: 0,
            membership_date_expired: getCurrentDate_Add_OneYear(),
            specialty: '',
            code: ''
        })

    //#endregion


    //#region 2) --> useEffect
    
        // reset fieldname everytime form closed
        useEffect(() => {
            if(!form_user) {
                setUser ({
                    id: 0,
                    role: 'customer',
                    name: '',
                    email: '',
                    phoneNo: '',
                    status: '',
                    password: '',
                    specialty: '',
                    code: ''
                })
            }
            if(!form_membership) {
                setMembership ({
                    id: 0,
                    role: '',
                    name: '',
                    email: '',
                    phoneNo: '',
                    status: '',
                    password: '',
                    membership_id: 0,
                    membership_date_expired: getCurrentDate_Add_OneYear(),
                    specialty: '',
                    code: ''
                })
            }
            // if(!form_voucher) {
            //     setSelected_voucher ({
            //         id: 0,
            //         quantity: 0
            //     })
            // }
        }, [form_user, form_membership])

        // change 'code' and 'expiry date'
        useEffect(() => {
            const selectedMembership = databaseMembership.find((item) => item.membership.id === membership?.membership_id);
            // a) code
        

            // b) expiry date
                const expiredDate = new Date();
                expiredDate.setMonth(expiredDate.getMonth() + (selectedMembership?.membership.duration ?? 0));
                const formattedDate = expiredDate.toISOString().split('T')[0];

            // c) assign data    
            setMembership((prev) => ({
                ...prev,
                membership_date_expired: formattedDate
            }))
        }, [membership.membership_id, form_membership])

    //#endregion

    
    //#region 3) --> method

        // #region a) --> user
            // edit user
            const handleEdit_user = (data: User_type) => {
                setUser(data)
                setForm_user(true)
                setCrud('edit')
            }

            // CREATE user
            const handleCreate_user = async () => {

                // loading
                setIsLoading(true)

                // CREATE data
                try {
                    await api.post(`/user`, {
                        role: user.role,
                        name: user.name,
                        email: user.email,
                        phoneNo: user.phoneNo,
                        password: user.password,
                    });

                    fetchData_user()
                    setForm_user(false)
                }
                catch(error) {
                    console.error('Error:', error); // use only to remove warning on vscode
                    // console.error('Response status:', error.response?.data);
                }
                finally {
                    setIsLoading(false)
                }
            }

            // UPDATE user
            const handleUpdate_user = async () => {

                // loading
                setIsLoading(true)

                // UPDATE data
                try {
                    await api.put(`/user/${user.id}`, {
                        role: user.role,
                        name: user.name,
                        email: user.email,
                        phoneNo: user.phoneNo,
                        password: user.password,

                        switch: 'user'
                    });

                    fetchData_user()
                    setForm_user(false)
                }
                catch(error) {
                    console.error('Error:', error); // use only to remove warning on vscode
                    // console.error('Response status:', error.response?.data);
                }
                finally {
                    setIsLoading(false)
                }
            }

            // DELETE user
            const handleDelete_user = async () => {
                
                setIsLoading(true)

                // DELETE data
                try {
                    await  api.delete(`/user/${selectedId}`)

                    fetchData_user()
                    setForm_user(false)
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
       
        // #region b) --> other
            const handleSelect_customer = (data: any, type: 'voucher' | 'membership' | 'privilege', crud: 'edit' | 'create' | 'view' ) => {
                setSelected_customer({
                    id: data.id,
                    name: data.name
                }) 

                // console.log('data = ',data.voucher_customers)
                setVoucher(data.voucher_customers)

                if(type == 'membership') {
                    if(crud == 'create') {
                        setForm_membership(true)
                    }
                }
                else if(type == 'voucher') {
                    
                    if(crud == 'create')
                        setForm_voucher(true)
                    else if(crud == 'view')
                        setForm_voucherList(true)
                }
            }

            // UPDATE voucher
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
                        date_expired: databaseVoucher[selectedIndex].date_expired,
                        serial_no: 'test',

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

            // UPDATE membership
            const handleUpdate_membership = async() => {
                // loading
                setIsLoading(true)
                
                try {
                    
                    await api.put(`/user/${selectedCustomer.id}`, {
                        membership_id: membership.membership_id,
                        membership_date_expired: membership.membership_date_expired,

                        switch: 'membership'
                    });

                    fetchData_user()
                    setForm_membership(false)
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

    //#endregion
    

    //#region 4) --> database
    
        const [databaseUser, setDatabase_user] = useState<User_type[]>([])
        const [databaseVoucher, setDatabase_voucher] = useState<Voucher_type[]>([])
        const [databaseMembership, setDatabase_membership] = useState<Membership_json[]>([])
        
        // customer
        const fetchData_user = useCallback(() => {

            // loading
            setSpinner(true)

            api.get(`/user`, {
                params: {
                    role: 'customer',
                    extra: 'full_customer'
                }
            })
            .then((response) => {
                console.log('data = ',response.data)
                setDatabase_user(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setSpinner(false)
            })
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
        // membership
        const fetchData_membership = useCallback(() => {

            // loading
            setSpinner(true)

            api.get(`/membership`)
            .then((response) => {

                // console.log('data = ',response.data)
                setDatabase_membership(response.data)
                
                // set data
                setMembership(prev => ({
                    ...prev,
                    membership_id: response.data[0]?.membership.id || 0
                }))
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setSpinner(false)
            })
        }, [])

        useEffect(() => {
            fetchData_user()
            fetchData_voucher()
            fetchData_membership()
        }, [])

        // tableTitle
        const tableTitle_user: Column<User_type>[] = [
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
                key: "booking",
                header: "Total Booking",
                align: "center",
                render: (row) => (
                    <span>{row.booking?.length}</span>
                )
            },
            {
                key: "add_membership",
                header: "membership",
                align: "center",
                render: (row) => (
                    <>
                        <div className="flex justify-center">
                            <div className="flex items-center border border-border rounded-md overflow-hidden bg-white">
                                {row.membership_id ? (
                                    <>
                                        <span className="px-4 py-1 text-sm font-medium">
                                            {row.membership?.tier}
                                        </span>
                                        <button onClick={() => handleSelect_customer(row, 'membership', 'edit')} className="px-3 py-1 bg-tertiary hover:opacity-70 transition-opacity text-black font-semibold cursor-pointer">
                                            <Eye size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="px-4 py-1 text-sm font-medium">
                                            -
                                        </span>
                                        <button onClick={() => handleSelect_customer(row, 'membership', 'create')}  className="px-3 py-1 bg-secondary hover:opacity-70 transition-opacity text-black font-bold cursor-pointer">
                                            +
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )
            },
            {
                key: "voucher",
                header: "Total Voucher",
                align: "center",
                render: (row) => (
                    <div className="flex justify-center">
                        <div className="flex items-center border border-border rounded-md overflow-hidden bg-white">
                            <span className="px-4 py-1 text-sm font-medium">
                                {row.voucher_customers?.length ?? 0} 
                            </span>

                            <button onClick={() => handleSelect_customer(row, 'voucher', 'view')} className="px-3 py-1 bg-tertiary hover:opacity-70 transition-opacity text-black font-bold cursor-pointer">
                                <Eye size={18} />
                            </button>
                            <button onClick={() => handleSelect_customer(row, 'voucher', 'create')} className="px-3 py-1 bg-secondary hover:opacity-70 transition-opacity text-black font-bold cursor-pointer">
                                +
                            </button>
                        </div>
                    </div>

                )
            },
            {
                key: "",
                header: "Action",
                render: (row) => (
                    <div className="flex gap-3">
                        <button onClick={() => handleEdit_user(row)} className="border border-border p-1 px-2 text-black text-sm rounded-md cursor-pointer">
                            Edit
                        </button>
                        
                        <button onClick={() => {setIs_alert(true), setSelected_id(row?.id|| 0)}} className="border border-danger p-1 px-2 text-danger text-sm rounded-md cursor-pointer">
                            Delete
                        </button>
                    </div>
                )
            },
        ];
        const tableTitle_voucher: Column<Voucher_customer_type>[] = [
            {
                key: "serial_np",
                header: "Serial no",
                render: (row) => (
                    <>
                        {row.serial_no ? (
                            <span>{row.serial_no}</span>
                        ) : (
                            <span>-</span>
                        )}
                    </>
                )
            },
            {
                key: "code",
                header: "Code",
                render: (row) => row.voucher.code
            },
            {
                key: "quantity",
                header: "Quantity",
                render: (row) => row?.quantity || 0
            },
            {
                key: "validTill",
                header: "Valid Till",
                render: (row) => row?.date_expired || '-'
            },
            {
                key: "status",
                header: "Status",
                render: (row) => (
                    <>
                        {Number(row.quantity) == 0 ? (
                            <span className="py-1 px-2 rounded-full bg-red-100 text-red-600">Redeemed</span>
                        ) : 
                        row.date_expired < getCurrentDate() ?(
                            <span className="py-1 px-2 rounded-full bg-red-100 text-red-600">Expired</span>
                        ):(
                            <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">Active</span>
                        )}

                    </>

                )
            },
            {
                key: "log",
                header: "History",
                align: "center",
                render: (row) => (
                    <>
                        {/* {row.log?.length > 0 ? ( */}
                        {(row.log ?? []).length > 0 ? (
                            <button onClick={() => {setLog(row.log ?? []); setForm_log(true)}} className="px-5 py-2 bg-secondary hover:opacity-80 active:scale-95 transition-all text-black text-sm font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            {/* <button className="px-5 py-2 bg-secondary hover:opacity-80 active:scale-95 transition-all text-black text-sm font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"> */}
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
        const tableTitle_log: Column<Log_voucher_type>[] = [
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
            {/* Filter */}
            <Grid className="md:grid-cols-7 items-center">
                <Searchbar placeholder="Search customers..." className="md:col-span-2 bg-white "/>
            </Grid>

            {/* Create */}
            <Grid className="md:grid-cols-5 items-center">
                <Label>{databaseUser.length} Customer</Label>
                <Button onClick={() => { setForm_user(true); setCrud('create')}} icon={Plus} label='Add Customer' className="md:col-start-5"/>
            </Grid>

            {/* Table */}
            <Grid>
                <Table fieldName={tableTitle_user} data={databaseUser} loading={spinner} />
            </Grid>


            {/* Form */} {/* User */}
            <Form title={crud=='create'? 'Add User':'Edit User'} isOpen={form_user} onClose={() => setForm_user(false)} width="max-w-lg"
                
                footer={
                    <>
                        <Button
                            label="Cancel"
                            className="w-24"
                            onClick={() => setForm_user(false)}
                            disabled={isLoading}
                        />

                        {crud == 'create' ? (
                            <Button
                                label="Save"
                                className="w-24"
                                onClick={handleCreate_user}
                                disabled={isLoading}
                            />
                        ) : (

                            <Button
                                label="Update"
                                className="w-24"
                                onClick={handleUpdate_user}
                                disabled={isLoading}
                            />
                        )}

                    </>
                }
            >
                <div className="space-y-4">
                    {/* for all role */}
                    <Field
                        label="Name"
                        placeholder="Enter name"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                    <Field
                        label="Email"
                        placeholder="Enter email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                    <Field
                        label="Phone"
                        placeholder="Enter phone number"
                        value={user.phoneNo}
                        onChange={(e) => setUser({ ...user, phoneNo: e.target.value })}
                    />
                    {/* <Field
                        label="Username"
                        placeholder="Enter username"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                    /> */}
                    <Field
                        label="Password"
                        placeholder="Enter password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        type="password"
                    />
                </div>
            </Form>
            
            {/* Form */} {/* Voucher */}
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
                    {/* <Field
                        label="Name"
                        value={selectedCustomer.name}
                        disabled
                    /> */}
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

            {/* Form */} {/* VoucherList */}
            <Form title='List of Voucher' isOpen={form_voucherList} onClose={() => setForm_voucherList(false)} width="max-w-xl">
                <div className="space-y-4">
                    <Table fieldName={tableTitle_voucher} data={voucher} loading={spinner} />
                </div>
            </Form>
            
            {/* Form */} {/* Membership */}
            <Form title={crud=='create'? 'Add Membership':'Edit Membership'} isOpen={form_membership} onClose={() => setForm_membership(false)} width="max-w-lg"
                
                footer={
                    <>
                        <Button
                            label="Cancel"
                            className="w-24"
                            onClick={() => setForm_membership(false)}
                            disabled={isLoading}
                        />

                        {crud == 'create' ? (
                            <Button
                                label="Save"
                                className="w-24"
                                onClick={handleUpdate_membership}
                                disabled={isLoading}
                            />
                        ) : (
                            <Button
                                label="Update"
                                className="w-24"
                                onClick={handleUpdate_membership}
                                disabled={isLoading}
                            />
                        )}

                    </>
                }
            >
                <div className="space-y-4">
                    {/* 1) */}
                    <Field
                        label="Tier"
                        value={membership.membership_id || ''}
                        onChange={(e) => setMembership({
                            ...membership,
                            membership_id: e.target.value === "" ? "" : Number(e.target.value)
                        })}
                        type="select"
                        options={databaseMembership.map((membership) => ({
                            label: membership.membership.tier,
                            value: membership.membership.id,
                        }))}
                    />
                    {/* 2) */}
                    {/* <Field
                        label="Code"
                        placeholder="SPA-2026-000"
                        value={membership.code || ''}
                        onChange={(e) => setMembership({...membership, code: e.target.value})}
                    /> */}
                    {/* 3)  */}
                    <Field
                        label="Expiry Date"
                        value={membership.membership_date_expired}
                        onChange={(e) => setMembership({...membership, membership_date_expired: e.target.value})}
                        type="date"
                    /> 
                </div>
            </Form>
            
            {/* Form */} {/*Log*/}
            <Form title='Booking history' isOpen={form_log} onClose={() => setForm_log(false)} width="max-w-4xl">
                <Table fieldName={tableTitle_log} data={log} loading={spinner} />
            </Form>

            {/* Delete*/} {/* User */}
            <Alert
                open={isAlert}
                title="Delete this user?"
                description="This action can't be undone."
                isLoading={isLoading}
                confirmLabel="Delete"
                onCancel={() => setIs_alert(false)}
                onConfirm={() => {
                    // do your action here
                    handleDelete_user()
                }}
            />
        </>
    )
}

export default Customers;