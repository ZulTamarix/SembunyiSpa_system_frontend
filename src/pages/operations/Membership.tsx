import { Plus, IdCard, Award } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import { Table, type Column } from "../../components/ui/Table";
import type { Membership_customer_json, Membership_customer_type, Membership_json, Membership_type } from "../../interface/membership";
import { useCallback, useEffect, useState } from "react";
import Form from "../../components/ui/Form";
import Field from "../../components/ui/Field";
import Bullet_point from "../../components/ui/Bullet_point";
import api from "../../api/axios";
import Tabs from "../../components/ui/Tab";
import type { User_customer_json } from "../../interface/user";

const Membership: React.FC = () => {

    
    //#region 0 --> main
    
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
                    fetchData_user_customer()
                    fetchData_customer()
                break;
                case 'membership': 
                break;
            }
        },[active])
        useEffect(() => {
            fetchData_membership()
        }, [])
    //#endregion

    //#region 1) --> customer

        //#region 1) --> useState
            // form
            const [form_customer, setForm_customer] = useState(false);
            // fieldname
            const [customer, setCustomer] = useState<Membership_customer_type> ({
                id: 0,
                user_customer_id: 0,
                membership_id: 0,
                code: '',
                date_joined: ''
            })

        //#endregion

        //#region 2) --> method
        
            // CREATE
            const handleCreate_customer = async() => {
                // loading
                setIsLoading(true)
                const test = {
                    
                        membership_id: customer.membership_id,
                        user_customer_id: customer.user_customer_id,
                        code: customer.code,
                        date_joined: customer.date_joined
                }
                console.log(test)

                try {
                    await api.post(`/membership`, {
                        type: 'customer',

                        membership_id: customer.membership_id,
                        user_customer_id: customer.user_customer_id,
                        code: customer.code,
                        date_joined: customer.date_joined
                    });

                    fetchData_customer()
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
                        id: 0,
                        user_customer_id: databaseUser_customer[0]?.user_customer.id ?? 1,
                        membership_id: databaseMembership[0]?.membership.id ?? 1,
                        code: '',
                        date_joined: ''
                    })
                }
            }, [form_customer])
        //#endregion
        
        //#region 4) --> database
            // const [databaseCustomer, setDatabase_customer] = useState<Customer_json[]>([])

            const [databaseUser_customer, setDatabase_user_customer] = useState<User_customer_json[]>([])
            const [databaseCustomer, setDatabase_customer] = useState<Membership_customer_json[]>([])

            // a) fetch 'user_customer'
            const fetchData_user_customer = useCallback(() => {

                api.get('/user', {
                    params: {
                        role: 'customer'
                    }
                })
                .then((response) => {
                    // console.log('data = ',response.data)
                    setDatabase_user_customer(response.data)

                    // set data
                    customer.user_customer_id = response.data[0].user_customer.id
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
            }, [])

            // b) fetch 'membership_customer'
            const fetchData_customer = useCallback(() => {
                api.get('/membership', {
                    params: {
                        type: 'customer'
                    }
                })
                .then((response) => {
                    console.log('data = ',response.data)
                    setDatabase_customer(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
            }, [])

            
            const tableTitle_customer: Column<Membership_customer_json>[] = [
                {
                    key: "member",
                    header: "Member",
                    render: (row) => row.user.name
                },
                {
                    key: "code",
                    header: "Number",
                    render: (row) => row.membership_customer.code
                },
                {
                    key: "tier",
                    header: "Tier",
                    render: (row) => row.membership.tier
                },
                {
                    key: "joined",
                    header: "Joined",
                    render: (row) => row.membership_customer.date_joined
                },
                {
                    key: "",
                    header: "",
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
            // fieldname
            const [membership, setMembership] = useState<Membership_type> ({
                id: 0,
                tier: '',
            })
            // privilege
            const [privilege, setPrivilege] = useState<string[]>([""]);

        //#endregion

        //#region 2) --> method
        
            // CREATE
            const handleCreate_membership = async() => {
                // loading
                setIsLoading(true)

                // clean any blank or ""
                const privilege_cleaned = privilege.filter(privilege => privilege !== "");
                try {
                    await api.post(`/membership`, {
                        type: 'membership',
                        
                        tier: membership.tier,
                        privilege_list: privilege_cleaned
                    });

                    fetchData_membership()
                    setForm_membership(false)
                }
                catch(error) {
                    console.error('Error:', error); // use only to remove warning on vscode
                    // console.error('Response status:', error.response?.message);
                    console.error('Response status:', error.response?.data);
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
                }
            }, [form_membership])
        //#endregion
        
        //#region 4) --> database
            const [databaseMembership, setDatabase_membership] = useState<Membership_json[]>([])

            const fetchData_membership = useCallback(() => {
                api.get('/membership', {
                    params: {
                        type: 'membership'
                    }
                })
                .then((response) => {

                    setDatabase_membership(response.data)
                    // console.log('data = ',response.data)
                    customer.membership_id = response.data[0].membership.id
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
            }, [])

            
            const tableTitle_membership: Column<Membership_json>[] = [
                {
                    key: "tier",
                    header: "Tier",
                    render: (row) => row.membership.tier
                },
                {
                    key: "privilege",
                    header: "Privilege",
                    render: (row) => row.membership_privilege.length
                },
                {
                    key: "",
                    header: "",
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
                        <span className=" text-title">{databaseMembership.length} membership</span>
                        <Button onClick={() => { setForm_customer(true); setCrud('create')}} icon={Plus} label='Add Membership' className="md:col-start-5"/>
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
                                        onClick={handleCreate_customer}
                                        disabled={isLoading}
                                    />
                                ) : (
                                    <Button
                                        label="Update"
                                        className="w-24"
                                        onClick={handleCreate_customer}
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
                                onChange={(e) => setCustomer({...customer, membership_id: Number(e.target.value)})}
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
                                value={customer.user_customer_id || ''}
                                onChange={(e) => setCustomer({...customer, user_customer_id: Number(e.target.value)})}
                                type="select"
                                options={
                                databaseUser_customer.map((user) => ({
                                    label: user.user.name,
                                    value: user.user_customer.id
                                }))}
                            />
                            {/* 3) */}
                            <Field
                                label="Code"
                                placeholder="SPA-2026-000"
                                value={customer.code || ''}
                                onChange={(e) => setCustomer({...customer, code: e.target.value})}
                            />
                            {/* 4) */}
                            <Field
                                label="Date joined"
                                value={customer.date_joined || ''}
                                onChange={(e) => setCustomer({...customer, date_joined: e.target.value})}
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
                        <span className="md:col-start-2  text-title">{databaseMembership.length} tier list</span>
                        <Button onClick={() => { setForm_membership(true); setCrud('create')}} icon={Plus} label='Create Tier List' className="md:col-start-4"/>
                    </Grid>

                    {/* Table */}
                    <Grid className="md:grid-cols-5">
                        <div className="md:col-start-2 col-span-3">
                            <Table fieldName={tableTitle_membership} data={databaseMembership} />
                        </div>
                    </Grid>

                    {/* Form */}
                    <Form title={crud=='create'? 'Add Tier List':'Edit Tier List'} isOpen={form_membership} onClose={() => setForm_membership(false)} width="max-w-lg"
                        
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
                            {/* 2) */}
                            <div className="col-span-2">
                                <Bullet_point
                                    value={privilege}
                                    onChange={setPrivilege}
                                    label="Privilege"
                                />
                            </div>
                        </div>
                    </Form>
                </>
            )}

        </>
    )
}

export default Membership;