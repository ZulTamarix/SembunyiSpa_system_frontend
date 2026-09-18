import { Component, Plus,  Warehouse } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import therapists from "../../JSON/therapist.json"
import { useCallback, useEffect, useState } from "react";
import { Sparkles, ClipboardList } from "lucide-react";
import { Table, type Column } from "../../components/ui/Table";
import type { Room_type } from "../../interface/room";
import api from "../../api/axios";
import Form from "../../components/ui/Form";
import Field from "../../components/ui/Field";

const Therapist: React.FC = () => {

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
                    <nav className="col-span-2 grid grid-cols-4 rounded-xl border border-border bg-white p-1.5 shadow-sm">
                        {tabs.map(({ id, label, icon: Icon }) => {
                            const isActive = active === id;
                            return (
                                    <button
                                        key={id}
                                        onClick={() => setActive(id)}
                                        className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer 
                                            ${isActive
                                            ? "bg-secondary text-black"
                                            : "text-title hover:bg-secondary hover:text-black"
                                        }`}
                                    >
                                    <Icon size={16} strokeWidth={2.4} />
                                    {label}
                                </button>
                            );
                        })}
                    </nav>
                </Grid>
            </>

            {/* #region 1 --> therapist */}
            {active == 'staff' && (
                <>
                    {/* Create */}
                    <Grid className="md:grid-cols-5 items-center">
                        <span className="text-title">{therapists.length} staff members</span>
                        <Button icon={Plus} label='Add Therapist' className="md:col-start-5"/>
                    </Grid>
                    
                    {/* table */}
                    <Grid className="md:grid-cols-3">
                        {therapists.map((data) => (
                            <div key={data.id} className="w-full rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-tertiary">
                                            <span className="text-2xl font-bold text-secondary">
                                                {data.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-stone-900">{data.name}</h2>
                                            <p className="text-sm text-title mt-1 ">{data.code}</p>
                                            {/* <p className="text-sm text-title">{data.designation}</p> */}
                                        </div>
                                    </div>

                                    <span className="whitespace-nowrap rounded-full bg-tertiary px-3 py-1.5 text-xs text-title font-semibold tracking-wide">
                                        {data.title}
                                    </span>
                                </div>

                                {/* Details */}
                                <div className="mt-6 space-y-1 text-[15px]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-title">Phone</span>
                                        <span className="font-medium text-title">{data.phoneNo}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-title">Email</span>
                                        <span className="font-medium text-title">{data.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-title">Bookable</span>
                                        <span className="font-medium text-title">
                                            {data.bookable ? "Yes" : "No"}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 flex gap-3">
                                    <button className="flex-1 rounded-full border border-border py-1 text-sm font-semibold text-title transition-colors hover:bg-stone-50">
                                        Edit
                                    </button>
                                    <button className="flex-1 rounded-full border border-border py-1 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-50">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </Grid>
                </>
            )}

            {/* #region 2 --> roster */}
            {active == 'duty' && (
                <>
                </>
            )}

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
                    <Form title={crud=='create'? 'Add Room':'Edit Room'} isOpen={form_room} onClose={() => setForm_room(false)}
                        
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
                                placeholder="Enter description"
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

export default Therapist;