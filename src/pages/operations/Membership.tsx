import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import { Table, type Column } from "../../components/ui/Table";
import type { Membership_json, Membership_type } from "../../interface/membership";
import { useCallback, useEffect, useState } from "react";
import Form from "../../components/ui/Form";
import Field from "../../components/ui/Field";
import api from "../../api/axios";
import Label from "../../components/ui/Label";
import type { Voucher_type } from "../../interface/vouchers";
import Alert from "../../components/ui/Alert";

const Membership: React.FC = () => {
    
    //#region 1) --> useState
        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        const [isLoading, setIsLoading] = useState(false);
        // loading state
        const [spinner, setSpinner] = useState(false)
        // form
        const [form_membership, setForm_membership] = useState(false);
        const [form_voucher, setForm_voucher] = useState(false);
        // fieldname (privilege)
        const [membership, setMembership] = useState<Membership_type> ({
            id: 0,
            tier: '',
            serial_code: '',
            duration: 0
        })
        // privilege
        const [privilege, setPrivilege] = useState<string[]>([""]);

        // selected id
        const [selectedId, setSelected_id] = useState(0);
        // a) detect error -> common
        const [isAlert, setIs_alert] = useState(false);
        // fieldname (voucher)
        const [voucher, setVoucher] = useState<Voucher_type[]> ([])
        // set current index
        const [index, setIndex] = useState(0)
        // quantity
        // const [unlimited, setUnlimited] = useState(false)
        const [unlimited, setUnlimited] = useState<boolean[]>([])

    //#endregion


    //#region 2) --> method
    
        // open popup (privilege)
        const handleOpen_voucher = (index: number) => {
            console.log('index = ',index)
            // a) voucher
            setVoucher((prev) => {
                if (prev[index]) {
                    // return prev;
                    return prev.map((item, i) =>
                        i === index
                            ? {
                                ...item,
                                description: privilege[index],
                            }
                            : item
                    );
                }

                return [
                    ...prev,
                    {
                        id: index,
                        code: '',
                        description: privilege[index],
                        type: 'gift',
                        date_expired: null,
                        status: 'active',
                        discount_type: 'discount_amount',
                        discount_value: 0,
                        quantity: 1
                    }
                ];
            });

            // b) unlimited
            setUnlimited((prev) => {
                if (prev[index] !== undefined) 
                    return prev;

                const newUnlimited = [...prev];
                while (newUnlimited.length <= index) 
                    newUnlimited.push(false);

                return newUnlimited;
            });

            setIndex(index)
            setForm_voucher(true)
            console.log('voucher = ',voucher)
        }
        const handleAdd_voucher = () => {
            // console.log('voucher = ',voucher)\
            setIndex(prev => prev+1)
            setForm_voucher(false)
        }

        const handleEdit_membership = (data: Membership_json) => {
            setMembership(data.membership)
            setVoucher(data.voucher ?? [])
            setForm_membership(true)
            setCrud('edit')
        }
        const handleEdit_voucher = (data: Voucher_type) => {
            // setVoucher(data)
            const index = voucher.findIndex((item) => item.id === data.id);
            setForm_voucher(true)
            setCrud('edit')
            setIndex(index)

            // console.log('data = ',data)
        }
        // CREATE (membership)
        const handleCreate_membership = async() => {
            // loading
            setIsLoading(true)

            try {
                await api.post(`/membership`, {
                    tier: membership.tier,
                    serial_code: membership.serial_code,
                    duration: membership.duration,
                    voucher_list: voucher
                });

                fetchData_membership()
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
        // UPDATE membership
        // const handleUpdate_membership = () => {

        // }
        // DELETE membership
        const handleDelete_membership = async () => {

            setIsLoading(true)

            // DELETE data
            try {
                await  api.delete(`/membership/${selectedId}`)

                fetchData_membership()
                setForm_membership(false)
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
    
        // remove fieldname everytime form closed
        useEffect(() => {
            if(!form_membership) {
                setMembership({
                    id: 0,
                    tier: '',
                    serial_code: '',
                    duration: 0
                })
                setPrivilege([''])
                setVoucher([])
            }
        }, [form_membership])
    //#endregion
    

    //#region 4) --> database
            const [databaseMembership, setDatabase_membership] = useState<Membership_json[]>([])
            const fetchData_membership = useCallback(() => {

                // loading
                setSpinner(true)

                api.get(`/membership`)
                .then((response) => {

                    // console.log('data = ',response.data)
                    setDatabase_membership(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setSpinner(false)
                })
            }, [])
            useEffect(() => {
                fetchData_membership()
            }, [])

            const tableTitle_membership: Column<Membership_json>[] = [
                {
                    key: "tier",
                    header: "Privilege name",
                    render: (row) => row.membership.tier
                },
                {
                    key: "privilege",
                    header: "Privilege",
                    render: (row) => row.voucher?.length
                },
                {
                    key: "duration",
                    header: "Duration",
                    render: (row) => `${row.membership.duration} months`
                },
                {
                    key: "",
                    header: "Action",
                    render: (row) => (
                        <div className="flex gap-3">
                            <button onClick={() => handleEdit_membership(row)} className="border border-border p-1 px-2 text-black text-sm rounded-md cursor-pointer">
                                Edit
                            </button>
                            
                            <button onClick={() => {setIs_alert(true), setSelected_id(row?.membership.id|| 0)}} className="border border-danger p-1 px-2 text-danger text-sm rounded-md cursor-pointer">
                                Delete
                            </button>
                        </div>
                    )
                },
            ];
            const tableTitle_voucher: Column<Voucher_type>[] = [
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
                                <span className="py-1 px-2 rounded-full bg-amber-100 text-amber-600">Gift</span>
                            ) : (
                                <span className="py-1 px-2 rounded-full bg-purple-100 text-purple-600">Promotional</span>
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
                            {/* <button  className="border border-border p-1 px-2 text-black text-sm rounded-md cursor-pointer"> */}
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
                <Label>{databaseMembership.length} Tier</Label>
                <Button onClick={() => { setForm_membership(true); setCrud('create')}} icon={Plus} label='Create Tier List' className="md:col-start-5"/>
            </Grid>

            {/* Table */}
            <Grid>
                <Table fieldName={tableTitle_membership} data={databaseMembership} loading={spinner} />
            </Grid>

            {/* Form (membership) */}
            <Form title={crud=='create'? 'Add Tier List':'Edit Tier List'} isOpen={form_membership} onClose={() => setForm_membership(false)} width="max-w-2xl"
                
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
                                onClick={handleCreate_membership}
                                disabled={isLoading}
                            />
                        ) : (
                            <Button
                                label="Update"
                                className="w-24"
                                onClick={handleCreate_membership}
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
                        placeholder="Gold, Silver, ..."
                        value={membership.tier}
                        onChange={(e) => setMembership({ ...membership, tier : e.target.value })}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* 2) */}
                        <Field
                            label="Serial code"
                            placeholder="GL, SL, ..."
                            value={membership.serial_code}
                            onChange={(e) => setMembership({ ...membership, serial_code : e.target.value })}
                        />
                        {/* 3) */}
                        <Field
                            label="Duration before expired (month)"
                            value={membership?.duration || 0}
                            onChange={(e) => setMembership({ ...membership, duration : Number(e.target.value) })}
                            type="number"
                        />
                    </div>

                    {/* 3) */}
                    <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="col-start-4">
                            <Field
                                key={index}
                                label="Add voucher"
                                type="button"
                                value="+"
                                onClick={() => handleOpen_voucher(index)}
                            />
                        </div>
                    </div>
                    {/* Table */}
                    <Table fieldName={tableTitle_voucher} data={voucher} loading={spinner} />
                </div>
            </Form>

            {/* Form (privilege)(voucher) */}
            <Form title={crud=='create'? 'Add Privilege':'Edit Privilege'} isOpen={form_voucher} onClose={() => setForm_voucher(false)} width="max-w-xl"
            
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
                                onClick={handleAdd_voucher}
                                // onClick={() => setIndex(prev => prev+1)}
                                disabled={isLoading}
                            />
                        ) : (
                            <Button
                                label="Update"
                                className="w-24"
                                onClick={handleAdd_voucher}
                                // disabled={isLoading}
                                disabled
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
                            value={voucher[index]?.code ?? ''}
                            onChange={(e) => (
                                setVoucher(
                                    voucher.map((item, i) =>
                                        i === index
                                            ? { ...item, code: e.target.value }
                                            : item
                                    )
                                )
                            )}
                        />
                        {/* 2) */}
                        <Field
                            label="Description"
                            placeholder="Enter a description"
                            value={voucher[index]?.description ?? ''}
                            onChange={(e) => (
                                setVoucher(
                                    voucher.map((item, i) =>
                                        i === index
                                            ? { ...item, description: e.target.value }
                                            : item
                                    )
                                )
                            )}
                            type="textarea"
                        />
                        {/* 3) */}
                        <Field
                            label="Date expired"
                            value={voucher[index]?.date_expired ?? ''}
                            onChange={(e) => (
                                setVoucher(
                                    voucher.map((item, i) =>
                                        i === index
                                            ? { ...item, date_expired: e.target.value }
                                            : item
                                    )
                                )
                            )}
                            type="date"
                            disabled
                        />
                        {/* 5) + 6) */}
                        <Field
                            label="Type"
                            placeholder="Choose a type"
                            value={voucher[index]?.type ?? ''}
                            onChange={(e) => (
                                setVoucher(
                                    voucher.map((item, i) =>
                                        i === index
                                            ? { ...item, type: e.target.value as 'gift' | 'promo' }
                                            : item
                                    )
                                )
                            )}
                            type="select"
                            options={[
                                { label: 'Gift', value: 'gift' },
                                { label: 'Promotional', value: 'promo' },
                            ]}
                        />
                        <div className="grid grid-cols-6">
                            <div className="col-span-3">
                                { unlimited[index] ? (
                                    <Field
                                        label="Quantity"
                                        value='∞'
                                        disabled
                                    />
                                ) : (
                                    <Field
                                        label="Quantity"
                                        value={voucher[index]?.quantity ?? ''}
                                        onChange={(e) => (
                                            setVoucher(
                                                voucher.map((item, i) =>
                                                    i === index
                                                        ? { ...item, quantity: Number(e.target.value) }
                                                        : item
                                                )
                                            )
                                        )}
                                        type="number"
                                    />
                                )}
                                
                            </div>
                            <div className="col-start-5 col-span-2">
                                <Field
                                    label="Unlimited"
                                    value={unlimited[index] ?? 'false'}
                                    onChange={(e) => (
                                        setUnlimited((prev) =>
                                            prev.map((item, i) =>
                                                i === index
                                                    ? (e.target as HTMLInputElement).checked
                                                    : item
                                            )
                                        )
                                    )}
                                    type="switch"
                                />
                            </div>
                        </div>
                        {/* 7) */}
                        <Field
                            label="Discount type"
                            placeholder="Choose discount's type"
                            value={voucher[index]?.discount_type ?? ''}
                            onChange={(e) => (
                                setVoucher(
                                    voucher.map((item, i) =>
                                        i === index
                                            ? { ...item, discount_type: e.target.value as 'discount_amount' | 'discount_percentage' | 'time_extension' |  'complimentary' }
                                            : item
                                    )
                                )
                            )}
                            type="select"
                            options={[
                                { label: 'Price (fixed amount)', value: 'discount_amount' },
                                { label: 'Price (by percentage)', value: 'discount_percentage' },
                                { label: 'Free minutes', value: 'time_extension' }, 
                                { label: 'Complimentary', value: 'complimentary' }, 
                            ]}
                        />
                        {/* 8) */}
                        { voucher[index]?.discount_type == 'complimentary' ? (
                            <Field
                                label="Value (disable)"
                                value='-'
                                disabled
                            />
                        ) : (
                            <Field
                                label={
                                    voucher[index]?.discount_type=='discount_amount' ? 'Value (RM)' : 
                                    voucher[index]?.discount_type=='discount_percentage' ? 'Value (%)' :
                                    voucher[index]?.discount_type=='time_extension' ? 'Value (minute)' : ''
                                }
                                // placeholder="Enter"
                                value={voucher[index]?.discount_value ?? ''}
                                onChange={(e) => (
                                    setVoucher(
                                        voucher.map((item, i) =>
                                            i === index
                                                ? { ...item, discount_value: Number(e.target.value) }
                                                : item
                                        )
                                    )
                                )}
                                type="number"
                            />
                        )}
                    </Grid>
                </div>
            </Form>

            {/* Delete membership */}
            <Alert
                open={isAlert}
                title="Delete this membership?"
                description="This action can't be undone."
                isLoading={isLoading}
                confirmLabel="Delete"
                onCancel={() => setIs_alert(false)}
                onConfirm={() => {
                    // do your action here
                    handleDelete_membership()
                }}
            />

        </>
    )
}

export default Membership;