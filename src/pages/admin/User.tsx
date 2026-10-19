import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import { Table, type Column } from "../../components/ui/Table";
import type { User_type } from "../../interface/user";
import { useCallback, useEffect, useState } from "react";
import Form from "../../components/ui/Form";
import Field from "../../components/ui/Field";
import api from "../../api/axios";
import Label from "../../components/ui/Label";
import { getCurrentDate } from "../../utils/date";
import Alert from "../../components/ui/Alert";

const User: React.FC = () => {

    // #region 1) --> useState
        // a) fieldname-> common
        const [user, setUser] = useState<User_type>({
            id: 0,
            role: '',
            name: '',
            email: '',
            phoneNo: '',
            status: '',
            username: '',
            password: '',
            date_joined: getCurrentDate(),
            specialty: '',
            code: ''
        })
        // selected id
        const [selectedId, setSelected_id] = useState(0);
        // a) detect error -> common
        const [isAlert, setIs_alert] = useState(false);
        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        const [isLoading, setIsLoading] = useState(false);
        // form_user
        const [form_user, setForm_user] = useState(false);
        // database
        const [databaseUser, setDatabase_user] = useState<User_type[]>([])
        // loading state
        const [spinner, setSpinner] = useState(false)
        
    //#endregion


    // #region 2) --> useEffect
        // reset fieldname everytime form_user closed
        useEffect(() => {
            if(!form_user) {
                setUser ({
                    id: 0,
                    role: '',
                    name: '',
                    email: '',
                    phoneNo: '',
                    status: '',
                    username: '',
                    password: '',
                    date_joined: getCurrentDate(),
                    specialty: '',
                    code: ''
                })
            }
        }, [form_user])
    //#endregion


    // #region 3) --> method
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
                    username: user.username,
                    password: user.password,
                    date_joined: user.date_joined,

                    ...(user.role === 'therapist' && {
                        specialty: user.specialty,
                        code: user.code
                    }),
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
                    username: user.username,
                    password: user.password,
                    date_joined: user.date_joined,

                    ...(user.role === 'therapist' && {
                        specialty: user.specialty,
                        code: user.code
                    }),

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
    

    // #region 4) --> database
    
        // tableTitle
        const tableTitle: Column<User_type>[] = [
            {
                key: "name",
                header: "Name",
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
                key: "role", 
                header: "Role",
                render: (row) => (
                    <>
                        {row.role == 'admin' ? (
                            <span className="py-1 px-2 rounded-full bg-amber-100 text-amber-500">Administrator</span>
                        ) : 
                        row.role == 'therapist' ? (
                            <span className="py-1 px-2 rounded-full bg-purple-100 text-purple-600">Therapist</span>
                        ) : 
                        // row.role == 'customer' ? (
                        //     <span className="py-1 px-2 rounded-full bg-cyan-100 text-cyan-500">Customer</span>
                        // ) : 
                        // row.role == 'walkin' ? (
                        //     <span className="py-1 px-2 rounded-full bg-red-100 text-rose-400">Walkin</span>
                        // ) : 
                        (
                            <span>-</span>
                        )} 
                    </>
                )
            },
            { key: "email", header: "Email" },
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

        // fetch database
        const fetchData_user = useCallback(() => {
            
            // loading
            setSpinner(true)

            api.get(`/user`, {
                params: {
                    role: 'therapist',
                    extra_1: 'include_admin'
                }
            })
            .then((response) => {
                console.log('response  = ',response.data)
                setDatabase_user(response.data);
            })
            .catch((error) => {
                console.error('Error fetching:', error);
            })
            .finally(() => {
                setSpinner(false)
            })
        }, []);

        // fetch 'user' database
        useEffect(() => {
            fetchData_user()
        }, [])

    //#endregion

    
    return (
        <>
            {/* Create */}
            <Grid className="md:grid-cols-5 items-center">
                <Label>{databaseUser.length} User</Label>
                <Button onClick={()=> {setForm_user(true); setCrud('create')}} icon={Plus} label='Add User' className="md:col-start-5"/>
            </Grid>

            {/* table */}
            <Grid>
                <Table fieldName={tableTitle} data={databaseUser} loading={spinner} />
            </Grid>

            {/* create user */}
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
                    <Field
                        label="Role"
                        placeholder="Select role"
                        value={user.role}
                        onChange={(e) => setUser({ ...user, role: e.target.value as 'admin' | 'therapist' | 'customer' | 'walkin' })}
                        type="select"
                        options={[
                            { label: 'Administrator', value: 'admin' },
                            { label: 'Therapist', value: 'therapist' },
                            // { label: 'Customer', value: 'customer' },
                            // { label: 'Walk in', value: 'walkin' },
                        ]}
                    />
                    {/* conditional role only */}
                    {user.role == 'therapist' && (
                        <>
                            <Field
                                label="Specialty"
                                placeholder="Spa Manager"
                                value={user.specialty}
                                onChange={(e) => setUser({ ...user, specialty: e.target.value })}
                            />
                            <Field
                                label="Code"
                                placeholder="C1763"
                                value={user.code}
                                onChange={(e) => setUser({ ...user, code: e.target.value })}
                            />
                        </>
                    )}
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
                    <Field
                        label="Username"
                        placeholder="Enter username"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                    />
                    <Field
                        label="Password"
                        placeholder="Enter password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        type="password"
                    />
                    <Field
                        label="Date joined"
                        // placeholder="2026-03-12"
                        value={user.date_joined}
                        onChange={(e) => setUser({ ...user, date_joined: e.target.value })}
                        type="date"
                    />
                </div>
            </Form>

            {/* Delete user */}
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

export default User;