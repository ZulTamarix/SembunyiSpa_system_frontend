import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import { Table, type Column } from "../../components/ui/Table";
import Label from "../../components/ui/Label";
import { useCallback, useEffect, useState } from "react";
import Form from "../../components/ui/Form";
import Field from "../../components/ui/Field";
import { getCurrentDate } from "../../utils/date";
import api from "../../api/axios";
import type { User_type } from "../../interface/user";
import type { Voucher_type } from "../../interface/vouchers";
import Alert from "../../components/ui/Alert";

const Membership: React.FC = () => {
    
    //#region 1) --> useState

        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        const [isLoading, setIsLoading] = useState(false);
        // form
        const [form_voucher, setForm_voucher] = useState(false);
        // selected id
        const [selectedId, setSelected_id] = useState(0);
        // a) detect error -> common
        const [isAlert, setIs_alert] = useState(false);
        // fieldname
        const [voucher, setVoucher] = useState<Voucher_type> ({
            id: 0,
            code: '',
            description: '',
            type: 'gift',
            date_expired: getCurrentDate(),            
            status: 'active',
            discount_type: 'discount_amount',
            discount_value: 0,
            quantity: 1
        })
        // quantity
        const [unlimited, setUnlimited] = useState(false)
        const [selectedCustomer, setSelected_customer] = useState('all')
        // loading state
        const [spinner, setSpinner] = useState(false)

    //#endregion

    
    //#region 2) --> method

        // edit user
        const handleEdit_voucher = (data: Voucher_type) => {
            setVoucher(data)

            setForm_voucher(true)
            setCrud('edit')
        }

        // CREATE voucher
        const handleCreate_voucher = async () => {

            setIsLoading(true)
            // CREATE data
            try {
                await api.post(`/voucher`, {
                    code: voucher.code,
                    description: voucher.description,
                    type: voucher.type,
                    user_id: 7,
                    date_expired: voucher.date_expired,
                    status: voucher.status,
                    discount_type: voucher.discount_type,
                    discount_value: voucher.discount_value,
                    quantity: voucher.quantity,

                    selected_customer: selectedCustomer,

                    switch: 'voucher'
                });

                fetchData_voucher()
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

        // UPDATE voucher
        const handleUpdate_voucher = async () => {

            // loading
            setIsLoading(true)
            
            // UPDATE data
            try {
                await api.put(`/voucher/${voucher.id}`, {
                    code: voucher.code,
                    description: voucher.description,
                    type: voucher.type,
                    user_id: 7,
                    date_expired: voucher.date_expired,
                    status: voucher.status,
                    discount_type: voucher.discount_type,
                    discount_value: voucher.discount_value,
                    quantity: voucher.quantity,

                    selected_customer: selectedCustomer,

                    switch: 'voucher'
                });

                fetchData_voucher()
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

        // DELETE voucher
        const handleDelete_voucher = async () => {
            
            setIsLoading(true)

            // DELETE data
            try {
                await  api.delete(`/voucher/${selectedId}`)

                fetchData_voucher()
                setForm_voucher(false)
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

    
    //#region 3) --> useEffect
    
        // reset fieldname everytime form closed
        useEffect(() => {
            if(!form_voucher) {
                setVoucher ({
                    id: 0,
                    code: '',
                    description: '',
                    type: 'gift',
                    date_expired: getCurrentDate(),            
                    status: 'active',
                    discount_type: 'discount_amount',
                    discount_value: 0,
                    quantity: 1
                })
                setUnlimited(false)
            }
            else {
                if(!voucher.quantity)
                    setUnlimited(true)
            }
        }, [form_voucher])

        // a) logic for 'dicount_type'
        useEffect(() => {

            // discount_type
            if(voucher.discount_type == 'complimentary') 
                setVoucher ((prev) => ({
                    ...prev,
                    discount_value: ''
                }))
            else 
                setVoucher ((prev) => ({
                    ...prev,
                    discount_value: 0
                }))

        }, [voucher.discount_type])
        
        // // b) logic for 'quantity'
        useEffect(() => {
            //  quantity
            if(unlimited) 
                setVoucher ((prev) => ({
                    ...prev,
                    quantity: ''
                }))
            else 
                setVoucher ((prev) => ({
                    ...prev,
                    quantity: 1
                }))

        }, [unlimited])

    //#endregion
    
    
    //#region 4) --> database
        const [databaseVoucher, setDatabase_voucher] = useState<Voucher_type[]>([])
        const [databaseUser, setDatabase_user] = useState<User_type[]>([])
        const fetchData_voucher = useCallback(() => {

            // loading
            setSpinner(true)

            api.get(`/voucher`)
            .then((response) => {
                setDatabase_voucher(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setSpinner(false)
            })
        }, [])
        const fetchData_user = useCallback(() => {

            api.get(`/user`, {
                params: {
                    role: 'customer',
                }
            })
            .then((response) => {
                setDatabase_user(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }, [])
        useEffect(() => {
            fetchData_voucher()
            fetchData_user()
        }, [])

        // tableTitle
        const tableTitle: Column<Voucher_type>[] = [
            {
                key: "code",
                header: "Code",
                render: (row) => row.code
            },
            {
                key: "description",
                header: "Description",
                render: (row) => row.description
            },
            {
                key: "type",
                header: "Type",
                render: (row) => (
                    <>
                        {row.type == 'gift' ? (
                            <span className="py-1 px-2 rounded-full bg-amber-100 text-amber-600">Spa Voucher</span>
                        ) : (
                            <span className="py-1 px-2 rounded-full bg-purple-100 text-purple-600">Promotional</span>
                        )} 
                    </>
                )
            },
            {
                key: "validTill",
                header: "Valid Till",
                render: (row) => row.date_expired
            },
            {
                key: "status",
                header: "Status",
                render: (row) => (
                    <>
                        {row.status == 'active' ? (
                            <span className="py-1 px-2 rounded-full bg-green-100 text-green-600">Active</span>
                        ) : (
                            <span className="py-1 px-2 rounded-full bg-slate-100 text-slate-600">Inactive</span>
                        )} 
                    </>
                )
            },
            {
                key: "",
                header: "Action",
                render: (row) => (
                    <div className="flex gap-3">
                        <button onClick={() => handleEdit_voucher(row)} className="border border-border p-1 px-2 text-black text-sm rounded-md cursor-pointer">
                            Edit
                        </button>
                        
                        <button onClick={() => {setIs_alert(true), setSelected_id(row?.id|| 0)}} className="border border-danger p-1 px-2 text-danger text-sm rounded-md cursor-pointer">
                            Delete
                        </button>
                    </div>
                )
            },
        ];
    //#endregion
    

    return (
        <>
            {/* Create */}
            <Grid className="md:grid-cols-5 items-center">
                <Label>{databaseVoucher.length} voucher</Label>
                <Button onClick={() => { setForm_voucher(true); setCrud('create')}} icon={Plus} label='Create Voucher' className="md:col-start-5"/>
            </Grid>

            {/* Table */}
            <Grid>
                <Table fieldName={tableTitle} data={databaseVoucher} loading={spinner} />
            </Grid>
            
            {/* Form */}
            <Form title={crud=='create'? 'Add Voucher':'Edit Voucher'} isOpen={form_voucher} onClose={() => setForm_voucher(false)} width="max-w-2xl"
                
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
                                onClick={handleCreate_voucher}
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
                    <Grid className="md:grid-cols-2">

                        {/* 1) */}
                        <Field
                            label="Code"
                            placeholder="Enter a code"
                            value={voucher.code}
                            onChange={(e) => setVoucher({...voucher, code: e.target.value})}
                        />
                        {/* 2) */}
                        <Field
                            label="Description"
                            placeholder="Enter a description"
                            value={voucher.description}
                            onChange={(e) => setVoucher({...voucher, description: e.target.value})}
                            type="textarea"
                        />
                        {/* 3) */}
                        <Field
                            label="Date expired"
                            value={voucher?.date_expired || ''}
                            onChange={(e) => setVoucher({...voucher, date_expired: e.target.value})}
                            type="date"
                        />
                        {/* 4) */}
                        <Field
                            label="Customer"
                            value={selectedCustomer}
                            onChange={(e) => setSelected_customer(e.target.value)}
                            type="select"
                            options={[
                                // { label:'-- All customer --', value: 'all'},
                                // { label:'-- Blank voucher --', value: 'blank'},
                                ...databaseUser.map((user) => ({
                                    label: user.name,
                                    value: user.id
                                }))
                            ]}
                            disabled={crud == 'edit'}
                        />
                        {/* 5) + 6) */}
                        <Field
                            label="Type"
                            placeholder="Choose a type"
                            value={voucher.type}
                            onChange={(e) => setVoucher({...voucher, type: e.target.value as 'gift' | 'promo'})}
                            type="select"
                            options={[
                                { label: 'Spa Voucher', value: 'gift' },
                                { label: 'Promotional', value: 'promo' },
                            ]}
                        />
                        <div className="grid grid-cols-5">
                            <div className="col-span-3">
                                { unlimited ? (
                                    <Field
                                        label="Quantity"
                                        value='∞'
                                        disabled
                                    />
                                ) : (
                                    <Field
                                        label="Quantity"
                                        value={voucher.quantity}
                                        onChange={(e) => setVoucher({
                                            ...voucher,
                                            quantity: e.target.value === "" ? "" : Number(e.target.value)
                                        })}
                                        type="number"
                                    />
                                )}
                               
                            </div>
                            <div className="col-start-5">
                                <Field
                                    label="Unlimited"
                                    value={unlimited}
                                    onChange={(e) => setUnlimited((e.target as HTMLInputElement).checked)}
                                    type="switch"
                                />
                            </div>
                        </div>
                        {/* 7) */}
                        <Field
                            label="Discount type"
                            placeholder="Choose discount's type"
                            value={voucher.discount_type}
                            onChange={(e) => setVoucher({...voucher, discount_type: e.target.value as 'discount_amount' | 'discount_percentage' | 'time_extension' |  'complimentary'})}
                            type="select"
                            options={[
                                { label: 'Price (fixed amount)', value: 'discount_amount' },
                                { label: 'Price (by percentage)', value: 'discount_percentage' },
                                { label: 'Free minutes', value: 'time_extension' }, 
                                { label: 'Complimentary', value: 'complimentary' }, 
                            ]}
                        />
                        {/* 8) */}
                        { voucher.discount_type == 'complimentary' ? (
                            <Field
                                label="Value (disable)"
                                value='-'
                                disabled
                            />
                        ) : (
                            <Field
                                label={
                                    voucher.discount_type=='discount_amount' ? 'Value (RM)' : 
                                    voucher.discount_type=='discount_percentage' ? 'Value (%)' :
                                    voucher.discount_type=='time_extension' ? 'Value (minute)' : ''
                                }
                                // placeholder="Enter"
                                value={voucher.discount_value}
                                onChange={(e) => setVoucher({
                                    ...voucher,
                                    discount_value: e.target.value === "" ? "" : Number(e.target.value)
                                })}
                                type="number"
                            />
                        )}
                    </Grid>
                </div>
            </Form>
            
            {/* Delete voucher */}
            <Alert
                open={isAlert}
                title="Delete this voucher?"
                description="This action can't be undone."
                isLoading={isLoading}
                confirmLabel="Delete"
                onCancel={() => setIs_alert(false)}
                onConfirm={() => {
                    // do your action here
                    handleDelete_voucher()
                }}
            />
        </>
    )
}

export default Membership;