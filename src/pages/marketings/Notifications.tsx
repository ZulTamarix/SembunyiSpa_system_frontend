import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import { useCallback, useEffect, useState } from "react";
import type { Notification_type } from "../../interface/notification";
import Form from "../../components/ui/Form";
import api from "../../api/axios";
import Field from "../../components/ui/Field";
import { Table, type Column } from "../../components/ui/Table";
import Label from "../../components/ui/Label";
import Alert from "../../components/ui/Alert";

const Notifications: React.FC = () => {
    
    //#region 0) --> temporary
        // const iconStyle = "text-2xl";
        // const titleStyle = "font-semibold";
        // const dataStyle = "text-sm text-title";
        // const infoStyle = "font-semibold text-secondary";
    //#endregion


    //#region 1) --> useState

        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        const [isLoading, setIsLoading] = useState(false);
        // selected id
        const [selectedId, setSelected_id] = useState(0);
        // a) detect error -> common
        const [isAlert, setIs_alert] = useState(false);
        // form
        const [form_notification, setForm_notification] = useState(false);
        // fieldname
        const [notification, setNotification] = useState<Notification_type> ({
            id: 0,
            role: 'customer',
            title: '',
            description: ''
        })
        // loading state
        const [spinner, setSpinner] = useState(false)

    //#endregion


    //#region 2) --> useEffect
    
        // reset fieldname everytime form closed
        useEffect(() => {
            if(!form_notification) {
                setNotification ({
                    id: 0,
                    role: 'customer',
                    title: '',
                    description: ''
                })
            }
        }, [form_notification])

    //#endregion
    

    //#region 3) --> method

        // edit user
        const handleEdit_notification = (data: Notification_type) => {
            setNotification(data)

            setForm_notification(true)
            setCrud('edit')
        }

        // CREATE notification
        const handleCreate_notification = async () => {

            setIsLoading(true)

            // CREATE data
            try {
                await api.post(`/notification`, {
                    role: notification.role,
                    title: notification.title,
                    description: notification.description,
                });

                fetchData_notification()
                setForm_notification(false)
            }
            catch(error) {
                console.error('Error:', error); // use only to remove warning on vscode
                // console.error('Response status:', error.response?.data);
            }
            finally {
                setIsLoading(false)
            }
        }

        // UPDATE notification
        const handleUpdate_notification = async () => {

            // loading
            setIsLoading(true)

            // UPDATE data
            try {
                await api.put(`/notification/${notification.id}`, {
                    role: notification.role,
                    title: notification.title,
                    description: notification.description
                });

                fetchData_notification()
                setForm_notification(false)
            }
            catch(error) {
                console.error('Error:', error); // use only to remove warning on vscode
                // console.error('Response status:', error.response?.data);
            }
            finally {
                setIsLoading(false)
            }
        }

        // DELETE notification
        const handleDelete_notification = async () => {
            
            setIsLoading(true)

            // DELETE data
            try {
                await  api.delete(`/notification/${selectedId}`)

                fetchData_notification()
                setForm_notification(false)
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
        const tableTitle: Column<Notification_type>[] = [
            {
                key: "role",
                header: "Role",
                render: (row) => (
                    <span>{row.role}</span>
                ),
            },
            {
                key: "title",
                header: "Title",
                render: (row) => (
                    <span>{row.title}</span>
                ),
            },
            {
                key: "",
                header: "Action",
                render: (row) => (
                    <div className="flex gap-3">
                        <button onClick={() => handleEdit_notification(row)} className="border border-border p-1 px-2 text-black text-sm rounded-md cursor-pointer">
                            Edit
                        </button>
                        
                        <button onClick={() => {setIs_alert(true), setSelected_id(row?.id|| 0)}} className="border border-danger p-1 px-2 text-danger text-sm rounded-md cursor-pointer">
                            Delete
                        </button>
                    </div>
                )
            },
        ];

        // b) notification
        const [databaseNotification, setDatabase_notification] = useState<Notification_type[]>([])
        const fetchData_notification = useCallback(() => {

            // loading
            setSpinner(true)

            api.get(`/notification`)
            .then((response) => {
                // console.log('data = ',response.data)
                setDatabase_notification(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(()=> {
                setSpinner(false)
            })
        }, [])

        useEffect(() => {
            fetchData_notification()
        }, [])
    //#endregion
    

    return (
        <>
            <Grid className="md:grid-cols-5 items-center">
                <Label>{databaseNotification.length} voucher</Label>
                <Button onClick={() => { setForm_notification(true); setCrud('create')}} icon={Plus} label='Create Notification' className="md:col-start-5"/>
            </Grid>

            {/* Info */}
            {/* <Grid className="md:grid-cols-3">
                <Card>
                    <div className="flex flex-col gap-2">
                        <span className={iconStyle}>📅</span>
                        <span className={titleStyle}>Booking Notifications</span>
                        <span className={dataStyle}>Booking confirmation, updates, and cancellations</span>
                        <span className={infoStyle}>8 templates</span>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col gap-2">
                        <span className={iconStyle}>⏰</span>
                        <span className={titleStyle}>Reminder Notifications</span>
                        <span className={dataStyle}>Appointment reminders and follow-ups</span>
                        <span className={infoStyle}>5 templates</span>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col gap-2">
                        <span className={iconStyle}>🎁</span>
                        <span className={titleStyle}>Promotional Notifications</span>
                        <span className={dataStyle}>Marketing campaigns and special offers</span>
                        <span className={infoStyle}>3 templates</span>
                    </div>
                </Card>
            </Grid> */}
            
            {/* Table */}
            <Grid>
                <Table fieldName={tableTitle} data={databaseNotification} loading={spinner} />
            </Grid>

            {/* Form */}
            <Form title={crud=='create'? 'Add Notification':'Edit Notification'} isOpen={form_notification} onClose={() => setForm_notification(false)} width="max-w-2xl"
                
                footer={
                    <>
                        <Button
                            label="Cancel"
                            className="w-24"
                            onClick={() => setForm_notification(false)}
                            disabled={isLoading}
                        />

                        {crud == 'create' ? (
                            <Button
                                label="Save"
                                className="w-24"
                                onClick={handleCreate_notification}
                                disabled={isLoading}
                            />
                        ) : (
                            <Button
                                label="Update"
                                className="w-24"
                                onClick={handleUpdate_notification}
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
                            label="Choose group"
                            value={notification.role}
                            onChange={(e) => setNotification({...notification, role: e.target.value as 'therapist' | 'customer'})}
                            type="select"
                            options={[
                                { label: 'Customer', value: 'customer' },
                                { label: 'Therapist', value: 'therapist' },
                            ]}
                            disabled={crud == 'edit'}
                            
                        />
                        {/* 2) */}
                        <Field
                            label="Title"
                            placeholder="Enter title for the description"
                            value={notification.title}
                            onChange={(e) => setNotification({...notification, title: e.target.value})}
                        />
                        {/* 3) */}
                        <div className="col-span-2">
                            <Field
                                label="Description"
                                placeholder="Enter a description"
                                value={notification.description}
                                onChange={(e) => setNotification({...notification, description: e.target.value})}
                                type="textarea"
                            />
                        </div>
                    </Grid>
                </div>
            </Form>
                        
            {/* Delete notification */}
            <Alert
                open={isAlert}
                title="Delete this notification?"
                description="This action can't be undone."
                isLoading={isLoading}
                confirmLabel="Delete"
                onCancel={() => setIs_alert(false)}
                onConfirm={() => {
                    // do your action here
                    handleDelete_notification()
                }}
            />
        </>
    )
}

export default Notifications;