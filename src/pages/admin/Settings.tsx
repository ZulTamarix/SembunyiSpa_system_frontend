import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Field from "../../components/ui/Field";
import { useCallback, useEffect, useState } from "react";
import { Table, type Column } from "../../components/ui/Table";
import type { Room_type } from "../../interface/room";
import { ClipboardList, Component, Plus, Sparkles, Warehouse } from "lucide-react";
import Form from "../../components/ui/Form";
import api from "../../api/axios";
import Tabs from "../../components/ui/Tab";

const Settings: React.FC = () => {
    
    //#region 0 --> main
    
        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        const [isLoading, setIsLoading] = useState(false);

        // swap section
        const [active, setActive] = useState("staff");
        const tabs = [
            { id: "staff", label: "Staff Directory", icon: Sparkles },
            { id: "duty", label: "Duty Roster", icon: ClipboardList },
            { id: "room", label: "Room", icon: Warehouse },
            { id: "legend", label: "Legend", icon: Component },
        ];
        useEffect(() => {
            switch(active) {
                case 'staff': 
                break;
                case 'duty': 
                break;
                case 'room': 
                    fetchData_room()
                break;
            }
        },[active])
    //#endregion

    
    //#region 3 --> room

        // form
        const [form_room, setForm_room] = useState(false);
        // fieldname
        const [room, setRoom] = useState("");
        const [description, setDescription] = useState("");
        // database
        const [databaseRoom, setDatabase_room] = useState<Room_type[]>([])
        // for detecting error
        const [errorRoom, setError_room] = useState<Partial<Record<keyof Room_type, string>>>({});

        // tableTitle
        const tableTitle: Column<Room_type>[] = [
            { key: "name", header: "Room" },
            { key: "description", header: "Description" },
            {
                key: "",
                header: "",
                render: (item) => (
                    <div className="flex gap-3">
                        <button onClick={() => editRoom(item)} className="border border-border p-1 px-2 text-black text-sm rounded-md cursor-pointer">
                            Edit
                        </button>
                        
                        <button className="border border-danger p-1 px-2 text-danger text-sm rounded-md cursor-pointer">
                            Delete
                        </button>
                    </div>
                )
            },
        ];

        // remove fieldname everytime form closed
        useEffect(() => {
            if(!form_room) {
                setRoom('')
                setDescription('')
                setError_room({})
            }
        }, [form_room])

        // edit
        const editRoom = (item: Room_type) => {
            setRoom(item.name)
            setDescription(item.description)
            
            setCrud('edit')
            setForm_room(true)
        }
        // fetch database
        const fetchData_room = useCallback(() => {
            api.get(`/room`)
            .then((response) => {
                const data = response.data ?? [];
                setDatabase_room(data);
            })
            .catch((error) => {
                console.error('Error fetching:', error);
            });
        }, []);
        // CREATE
        const handleCreate_room = async() => {
            // check error
            const newError_room: Partial<Record<keyof Room_type, string>> = {};
            if (!room.trim()) 
                newError_room.name = "Role is required";
            if (!description.trim()) 
                newError_room.description = "Name is required";
            setError_room(newError_room);

            // Stop here if there are errorRoom
            if (Object.keys(newError_room).length > 0) 
                return;

            // loading
            setIsLoading(true)
            try {
                await api.post(`/room`, {
                    name: room,
                    description: description
                });

                fetchData_room()
                setForm_room(false)
            }
            catch(error) {
                console.error('Error:', error); // use only to remove warning on vscode
                // console.error('Response status:', error.response?.message);
            }
            finally {
                setIsLoading(false)
            }
        }

    //#endregion


    return (
        <>
            {/* #region 0 --> main */}
            <>
                <Grid className="md:grid-cols-3">
                    <Tabs className="col-span-2 grid grid-cols-4" tabs={tabs} active={active} setActive={setActive} />
                </Grid>
            </>

            {/* #region 3 --> room */}
            {active == 'room' && (
                <>
                    {/* Create */}
                    <Grid className="md:grid-cols-5 items-center">
                        <span className="md:col-start-2 text-title">{databaseRoom.length} rooms</span>
                        <Button onClick={() => { setForm_room(true); setCrud('create')}} icon={Plus} label='Add Room' className="md:col-start-4"/>
                    </Grid>

                    {/* table */}
                    <Grid className="md:grid-cols-5">
                        <div className="md:col-start-2 col-span-3">
                            <Table fieldName={tableTitle} data={databaseRoom}  />
                        </div>
                    </Grid>

                    {/* create room */}
                    <Form title={crud=='create'? 'Add Room':'Edit Room'} isOpen={form_room} onClose={() => setForm_room(false)} width="max-w-lg"
                        
                        footer={
                            <>
                                <Button
                                    label="Cancel"
                                    className="w-24"
                                    onClick={() => setForm_room(false)}
                                    disabled={isLoading}
                                />

                                {crud == 'create' ? (
                                    <Button
                                        label="Save"
                                        className="w-24"
                                        onClick={handleCreate_room}
                                        disabled={isLoading}
                                    />
                                ) : (

                                    <Button
                                        label="Update"
                                        className="w-24"
                                        onClick={handleCreate_room}
                                        disabled={isLoading}
                                    />
                                )}

                            </>
                        }
                    >
                        <div className="space-y-4">
                            <Field
                                label="Room"
                                placeholder="Enter room name"
                                value={room}
                                error={errorRoom.name}
                                onChange={(e) => setRoom(e.target.value)}
                            />

                            <Field
                                label="Description"
                                placeholder="Single room / Couple room / ...."
                                value={description}
                                error={errorRoom.description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </Form>
                    
                </>
            )}
        </>
    )
}

export default Settings;