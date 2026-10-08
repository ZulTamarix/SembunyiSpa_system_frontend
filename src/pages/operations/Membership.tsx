import { Plus, IdCard, Award } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import { Table, type Column } from "../../components/ui/Table";
import type { Membership_json, Membership_type } from "../../interface/membership";
import { useCallback, useEffect, useState } from "react";
import Form from "../../components/ui/Form";
import Field from "../../components/ui/Field";
import api from "../../api/axios";
import Tabs from "../../components/ui/Tab";
import type { User_type } from "../../interface/user";
import Label from "../../components/ui/Label";
import type { Voucher_type } from "../../interface/vouchers";
import { getCurrentDate } from "../../utils/date";

const Membership: React.FC = () => {

    
    //#region 0) --> main
    
        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        const [isLoading, setIsLoading] = useState(false);

        // swap section
        // const [active, setActive] = useState<'membership' | 'tier'>("membership");
        const [active, setActive] = useState("customer");
        const tabs = [
            { id: "customer", label: "Membership", icon: IdCard },
            { id: "membership", label: "Tier List", icon: Award },
        ];
        useEffect(() => {
            switch(active) {
                case 'customer': 
                break;
                case 'membership': 
                break;
            }
        },[active])
        useEffect(() => {
            fetchData_user()
            fetchData_customer()
            fetchData_membership()
        }, [])
    //#endregion


    //#region 1) --> customer

        //#region 1) --> useState
            // form
            const [form_customer, setForm_customer] = useState(false);
            // fieldname
            const [customer, setCustomer] = useState<User_type> ({
                id: 0,
                role: '',
                name: '',
                email: '',
                phoneNo: '',
                status: '',
                password: '',
                date_joined: '',
                membership_id: 0,
                membership_date_expired: getCurrentDate(),
                specialty: '',
                code: ''
            })
            
        //#endregion

        //#region 2) --> method
        
            // UPDATE
            const handleUpdate_customer = async() => {
                // loading
                setIsLoading(true)
                
                try {
                    
                    await api.put(`/user/${customer.id}`, {
                        membership_id: customer.membership_id,
                        membership_date_expired: customer.membership_date_expired,
                        code: customer.code,

                        switch: 'membership'
                    });

                    fetchData_customer()
                    fetchData_user()
                    setForm_customer(false)
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
                if(!form_customer) {
                    setCustomer({
                        id: databaseUser[0]?.id ?? 1,
                        role: '',
                        name: '',
                        email: '',
                        phoneNo: '',
                        status: '',
                        password: '',
                        date_joined: '',
                        membership_id: databaseMembership[0]?.membership.id ?? 1,
                        membership_date_expired: getCurrentDate(),
                        specialty: '',
                        code: ''
                    })
                }
            }, [form_customer])
        //#endregion
        
        //#region 4) --> database
            const [databaseUser, setDatabase_user] = useState<User_type[]>([])
            const [databaseCustomer, setDatabase_customer] = useState<Membership_json[]>([])

            // a) fetch 'user'
            const fetchData_user = useCallback(() => {

                api.get(`/user`, {
                    params: {
                        role: 'customer',
                        extra_1: 'no_membership' // call all user that dont have membership yet
                    }
                })
                .then((response) => {
                    // console.log('user = ',response.data)
                    setDatabase_user(response.data)

                    // set data
                    setCustomer(prev => ({
                        ...prev,
                        id: response.data[0]?.id || 0
                    }))
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
            }, [])

            // b) fetch 'customer'
            const fetchData_customer = useCallback(() => {

                api.get(`/user`, {
                    params: {
                        role: 'customer',
                        extra_1: 'membership'
                    }
                })
                .then((response) => {
                    console.log('customer = ',response.data)
                    setDatabase_customer(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
            }, [])
            
            const tableTitle_customer: Column<Membership_json>[] = [
                {
                    key: "member",
                    header: "Member",
                    render: (row) => row.user.name
                },
                {
                    key: "code",
                    header: "Number",
                    render: (row) => row.user.code
                },
                {
                    key: "tier",
                    header: "Tier",
                    render: (row) => (
                        <span className="py-1 px-2 rounded-full bg-tertiary border border-border text-title font-semibold">
                           {row.membership.tier} member
                        </span>
                    )
                },
                {
                    key: "privilege",
                    header: "Privilege",
                    render: (row) => `${row.membership.voucher?.length} privileges`
                },
                {
                    key: "",
                    header: "Action",
                    render: () => (
                        <button className="border border-border p-1 px-2 text-black text-sm rounded-md">
                            Edit
                        </button>
                    )
                },
            ];
        //#endregion
    
    //#endregion


    //#region 2) --> membership

        //#region 1) --> useState
            // form
            const [form_membership, setForm_membership] = useState(false);
            const [form_voucher, setForm_voucher] = useState(false);
            // fieldname (privilege)
            const [membership, setMembership] = useState<Membership_type> ({
                id: 0,
                tier: '',
            })
            // privilege
            const [privilege, setPrivilege] = useState<string[]>([""]);

            // fieldname (voucher)
            const [voucher, setVoucher] = useState<Voucher_type[]> ([])
            // set current index
            const [index, setIndex] = useState(0)
            // quantity
            // const [unlimited, setUnlimited] = useState(false)
            const [unlimited, setUnlimited] = useState<boolean[]>([])
            // const [selectedCustomer, setSelected_customer] = useState('all')
            const [selectedCustomer, setSelected_customer] = useState<string[]>([])

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

                // c) selected customer
                setSelected_customer((prev) => {
                    if (prev[index] !== undefined) 
                        return prev;

                    const newSelected_customer = [...prev];
                    while (newSelected_customer.length <= index) 
                        newSelected_customer.push('blank');

                    return newSelected_customer;
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

            // CREATE (membership)
            const handleCreate_membership = async() => {
                // loading
                setIsLoading(true)
                console.log('memebrship = ',membership)
                console.log('voucher = ',voucher)

                try {
                    await api.post(`/membership`, {
                        tier: membership.tier,
                        voucher_list: voucher
                    });

                    // fetchData_membership()
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

        //#region 3) --> useEffect
        
            // remove fieldname everytime form closed
            useEffect(() => {
                if(!form_membership) {
                    setMembership({
                        id: 0,
                        tier: ''
                    })
                    setPrivilege([''])
                    setVoucher([])
                }
            }, [form_membership])
        //#endregion
        
        //#region 4) --> database
            const [databaseMembership, setDatabase_membership] = useState<Membership_json[]>([])

            const fetchData_membership = useCallback(() => {
                api.get(`/membership`)
                .then((response) => {

                    // console.log('data = ',response.data)
                    setDatabase_membership(response.data)
                    
                    // set data
                    setCustomer(prev => ({
                        ...prev,
                        membership_id: response.data[0].membership.id
                    }))
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
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
                    render: (row) => row.voucher.length
                },
                {
                    key: "",
                    header: "Action",
                    render: () => (
                        <button className="border border-border p-1 px-2 text-black text-sm rounded-md">
                            Edit
                        </button>
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
                    render: () => (
                        <button className="border border-border p-1 px-2 text-black text-sm rounded-md">
                            Edit
                        </button>
                    )
                },
            ];
        //#endregion
    
    //#endregion

    return (
        <>
            {/* #region 0 --> main */}
            <>
            <Grid className="md:grid-cols-5">
                <Tabs className="col-span-2 grid grid-cols-2" tabs={tabs} active={active} setActive={setActive} />
            </Grid>
            </>

            {active == 'customer' && (
                <>
                    {/* Create */}
                    <Grid className="md:grid-cols-5 items-center">
                        <Label>{databaseMembership.length} Membership</Label>
                        <Button onClick={() => { setForm_customer(true); setCrud('create')}} icon={Plus} label='Add Membership' disabled={databaseUser.length==0} className="md:col-start-5"/>
                    </Grid>

                    {/* Table */}
                    <Grid>
                        <Table fieldName={tableTitle_customer} data={databaseCustomer} />
                    </Grid>

                    {/* Form */}
                    <Form title={crud=='create'? 'Add Membership':'Edit Membership'} isOpen={form_customer} onClose={() => setForm_customer(false)} width="max-w-lg"
                        
                        footer={
                            <>
                                <Button
                                    label="Cancel"
                                    className="w-24"
                                    onClick={() => setForm_customer(false)}
                                    disabled={isLoading}
                                />

                                {crud == 'create' ? (
                                    <Button
                                        label="Save"
                                        className="w-24"
                                        onClick={handleUpdate_customer}
                                        disabled={isLoading}
                                    />
                                ) : (
                                    <Button
                                        label="Update"
                                        className="w-24"
                                        onClick={handleUpdate_customer}
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
                                // placeholder="Select role"
                                value={customer.membership_id || ''}
                                onChange={(e) => setCustomer({
                                    ...customer,
                                    membership_id: e.target.value === "" ? "" : Number(e.target.value)
                                })}
                                type="select"
                                options={databaseMembership.map((membership) => ({
                                    label: membership.membership.tier,
                                    value: membership.membership.id,
                                }))}
                            />
                            {/* 2) */}
                            <Field
                                label="Customer"
                                // placeholder="Select role"
                                value={customer.id || ''}
                                onChange={(e) => setCustomer({
                                    ...customer,
                                    id: e.target.value === "" ? "" : Number(e.target.value)
                                })}
                                type="select"
                                options={
                                    databaseUser.map((user) => ({
                                        label: user.name,
                                        value: user.id
                                    }))
                                }
                            />
                            {/* 3) */}
                            <Field
                                label="Code"
                                placeholder="SPA-2026-000"
                                value={customer.code || ''}
                                onChange={(e) => setCustomer({...customer, code: e.target.value})}
                            />
                            {/* 4)  */}
                            <Field
                                label="Expired Date (1 year after subscription date)"
                                // placeholder="2026-03-12"
                                value={customer.membership_date_expired}
                                onChange={(e) => setCustomer({...customer, membership_date_expired: e.target.value})}
                                type="date"
                            />
                        </div>
                    </Form>
                </>
            )}

            {active == 'membership' && (
                <>
                    {/* Create */}
                    <Grid className="md:grid-cols-5 items-center">
                        <Label>{databaseMembership.length} Tier</Label>
                        <Button onClick={() => { setForm_membership(true); setCrud('create')}} icon={Plus} label='Create Tier List' className="md:col-start-5"/>
                    </Grid>

                    {/* Table */}
                    <Grid>
                        <Table fieldName={tableTitle_membership} data={databaseMembership} />
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
                            {/* 2) */}
                            <div className="grid md:grid-cols-4">
                                {/* <div className="col-span-3">
                                    <Bullet_point
                                        value={privilege}
                                        onChange={setPrivilege}
                                        label="Privilege"
                                        placeholder="20% Discount on Food and Beverage"
                                    />
                                </div> */}
                                <div className="col-start-4">
                                <Field
                                    key={index}
                                    label="Add voucher"
                                    type="button"
                                    value="+"
                                    onClick={() => handleOpen_voucher(index)}
                                />
                                </div>
                                {/* <div className="col-span-1 space-y-2">
                                    {privilege.map((_, index) => (
                                        <Field
                                            key={index}
                                            label={index === 0 ? "Add voucher" : ""}
                                            type="button"
                                            value="+"
                                            onClick={() => handleOpen_voucher(index)}
                                        />
                                    ))}
                                </div> */}
                            </div>
                            {}
                            <Table fieldName={tableTitle_voucher} data={voucher} />
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
                                    />
                                ) : (
                                    <Button
                                        label="Update"
                                        className="w-24"
                                        onClick={handleAdd_voucher}
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
                                {/* 4) */}
                                <Field
                                    label="Customer"
                                    value={selectedCustomer[index] ?? 'all'}
                                    onChange={(e) => (
                                        setSelected_customer((prev) =>
                                            prev.map((item, i) =>
                                                i === index
                                                    ? e.target.value
                                                    : item
                                            )
                                        )
                                    )}
                                    type="select"
                                    options={[
                                        { label:'-- All customer --', value: 'all'},
                                        { label:'-- Blank voucher --', value: 'blank'},
                                        ...databaseUser.map((user) => ({
                                            label: user.name,
                                            value: user.id
                                        }))
                                    ]}
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
                </>
            )}

        </>
    )
}

export default Membership;