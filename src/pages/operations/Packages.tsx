import { Package, Plus, Settings, Sparkles } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import { useCallback, useEffect, useState } from "react";
import Form from "../../components/ui/Form";
import api from "../../api/axios";
import Field from "../../components/ui/Field";
import { type Package_category_type, type Package_json, type Package_type, type Service_json } from "../../interface/package";
import type { Room_type } from "../../interface/room";
import Label from "../../components/ui/Label";
import type { User_type } from "../../interface/user";
import Table, { type Column } from "../../components/ui/Table";
import Tabs from "../../components/ui/Tab";
import TextEditor from "../../components/ui/TextEditor";

// #region 0) a) --> Multi select

    interface MultiSelectOption {
        id: number;
        name: string;
        description?: string;
        price?: number | "";
        gender?: string;
        type?: string;
        duration?: number | "";
    }

    interface MultiSelectProps {
        label: string;
        options: MultiSelectOption[];
        selected: number[];
        onChange: (selected: number[]) => void;
    }

    function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {

        const toggleOption = (id: number) => {
            onChange(
                selected.includes(id)
                    ? selected.filter((selectedId) => selectedId !== id)
                    : [...selected, id]
            );
        };

        return (
            <div>
                {/* Label */}
                <label className="block mb-1.5 text-sm font-medium text-title">
                    {label}
                </label>

                <div className="rounded-lg border border-gray-300 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border-b border-gray-200">
                        <span className="text-sm text-title">
                            Select {label.toLowerCase()}
                        </span>

                        <span className="text-xs text-secondary">
                            {selected.length} selected
                        </span>
                    </div>

                    {/* List */}
                    <div className="max-h-60 overflow-y-auto bg-white">
                        {options.map((option) => {
                            const isSelected = selected.includes(option.id);

                            return (
                                <label
                                    key={option.id}
                                    className="flex items-center gap-3 px-3 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition hover:bg-gray-100"
                                >
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleOption(option.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-border focus:ring-border"
                                    />

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-title">
                                            {option.name}
                                        </p>

                                        {option.description && (
                                            <p className="text-xs text-secondary">
                                                {option.description}
                                            </p>
                                        )}

                                        {(option.price !== undefined ||
                                            option.gender ||
                                            option.type) && (
                                            <ul className="mt-1 text-xs text-title list-disc list-inside">

                                                {option.type && (
                                                    <li>{option.type}</li>
                                                )}

                                                {option.price !== undefined && (
                                                    <li>RM {option.price}</li>
                                                )}

                                                {option.duration && (
                                                    <li>{option.duration} minutes</li>
                                                )}

                                                {option.gender && (
                                                    <li>{option.gender}</li>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }


//#endregion

// #region 0) b) --> Package + Service table
    interface PackageCardProps {
        poster: string | File | null;
        title: string;
        description: string;
        price: number | "";
        duration: number | "";
        category?: string;
        onEdit?: () => void;
        onDelete?: () => void;
    }

    function PackageCard({ poster, title, description, price, duration, category, onEdit, onDelete }: PackageCardProps) {
        return (
            <div className="flex w-full flex-col rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
                {/* Poster */}
                <div className="mb-5 h-48 w-full overflow-hidden rounded-2xl">
                    <img
                        src={`http://localhost:8000/${poster}`}
                        alt={title}
                        className="h-full w-full"
                    />
                </div>

                {/* Header */}
                <div className="flex h-8 items-center justify-between">
                    {category ? (
                        <span className="whitespace-nowrap rounded-full bg-tertiary px-3 py-1.5 text-xs font-bold tracking-wide text-title uppercase">
                            {category}
                        </span>
                    ) : (
                        <span />
                    )}

                    <span className="text-lg font-bold">
                        RM {price}
                    </span>
                </div>

                {/* Title */}
                <div className="mt-3 h-6">
                    <h2 className="text-base font-serif font-bold text-stone-900 uppercase">
                        {title}
                    </h2>
                </div>

                {/* Description */}
                <div className="mt-3 flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-title font-semibold">
                            {description.length > 150
                                ? `${description.slice(0, 150)}...`
                                : description}
                        </span>
                    </div>
                </div>

                {/* Duration */}
                <div className="mt-3">
                    <span className="text-xs font-semibold text-title">
                        {duration} min
                    </span>
                </div>

                {/* Actions */}
                <div className="mt-3 flex gap-3">
                    <button
                        onClick={onEdit}
                        className="flex-1 rounded-full border border-border py-1 text-sm font-semibold text-title transition-colors hover:bg-stone-50"
                    >
                        Edit
                    </button>

                    <button
                        onClick={onDelete}
                        className="flex-1 rounded-full border border-border py-1 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-50"
                    >
                        Remove
                    </button>
                </div>
            </div>
        );
    }
//#endregion


const Packages: React.FC = () => {
    
    //#region 0) --> main
    
        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        const [isLoading, setIsLoading] = useState(false);
        // textEditor
        // const [content, setContent] = useState("");

        // swap section
        const [active, setActive] = useState("service");
        const tabs = [
            { id: "package", label: "Package", icon: Package },
            { id: "service", label: "Service", icon: Sparkles },
            { id: "setting", label: "Setting", icon: Settings },
        ];
        useEffect(() => {
            switch(active) {
                case 'package': 
                    fetchData_package()
                break;
                case 'service': 
                break;
                case 'room': 
                break;
            }
        },[active])

        
        // fetch database on load
        useEffect(() => {
            fetchData_service()
            fetchData_therapist()
            fetchData_room()
            fetchData_category()
        }, [])


        // a) therapist
        const [databaseTherapist, setDatabase_therapist] = useState<User_type[]>([])
        const fetchData_therapist = useCallback(() => {
        
            api.get(`/user`, {
                params: {
                    role: 'therapist',
                }
            })
            .then((response) => {
                // console.log('data = ',response.data)
                // 1) normal
                setDatabase_therapist(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error.data);
            });
        }, [])
    //#endregion


    // #region 1) + 2) --> package + service

        // #region 1) --> useState
            // fieldname
            const [packages, setPackages] = useState<Package_type> ({
                id: 0,
                poster: null,
                title: '',
                description: '',
                duration: 0,
                price: 0,
                gender: '',
                detail: '',
                type: active=='package'? 'package' : 'service',
                package_category_id: 0,
                is_standalone: null
            })
            // preview poster
            const [posterPreview, setPosterPreview] = useState<string | null>(null);
            // form
            const [form_package, setForm_package] = useState(false);

            const [selectedTherapist, setSelected_therapist] = useState<number[]>([]);
            const [selectedRoom, setSelected_room] = useState<number[]>([]);
            const [selectedService, setSelected_service] = useState<number[]>([]);
        //#endregion


        // #region 2) --> useEffect
            // reset fieldname everytime form closed
            useEffect(() => {
                if(!form_package) { 
                    setPackages ({
                        id: 0,
                        poster: null,
                        title: '',
                        description: '',
                        duration: 0,
                        price: 0,
                        gender: '',
                        detail: '',
                        type: active=='package'? 'package' : 'service',
                        package_category_id: databaseCategory[0]?.id,
                        is_standalone: null
                    })
                }
                setPosterPreview(null)
                setSelected_room([])
                setSelected_therapist([])
                setSelected_service([])
            }, [form_package])

            // change 'type'
            useEffect(() => {
                if(active == 'package') { 
                    setPackages ((prev) => ({
                        ...prev,
                        is_standalone: null,
                        type: 'package'
                    }))
                }
                else if(active == 'service') { 
                    setPackages ((prev) => ({
                        ...prev,
                        is_standalone: false,
                        type: 'service'
                    }))
                }
            }, [active])

            // set duration + price
            useEffect(() => {
                console.log('testing')

                const selectedTotal = databaseService
                    .filter(item => selectedService.includes(item?.service.id || 0))
                    .reduce(
                        (total, item) => {
                            total.duration += Number(item.service.duration || 0);
                            total.price += Number(item.service.price || 0);

                            return total;
                        },
                        { duration: 0, price: 0 }
                    );

                console.log('total = ', selectedTotal);

                setPackages((prev) => ({
                    ...prev,
                    duration: selectedTotal.duration,
                    price: selectedTotal.price,
                }))
            }, [selectedService])
        //#endregion
        

        // #region 3) --> method

            // CREATE service
            const handleCreate_package = async () => {
                // loading
                setIsLoading(true)

                // console.log('data = ',packages)
                // console.log('therapist = ',selectedTherapist)
                // console.log('room = ',selectedRoom)
                // console.log('service = ',selectedService)

                // format data to allow image uploading
                const formData = new FormData();

                if(packages.poster)
                    formData.append('poster', packages.poster);

                formData.append('title', packages.title);
                formData.append('description', packages.description);
                formData.append('duration', packages.duration.toString());
                formData.append('price', packages.price.toString());
                formData.append('gender', packages.gender);
                formData.append('type', packages.type);
                formData.append('detail', packages.detail);
                formData.append('package_category_id', packages.package_category_id?.toString() || '');

                // optional
                if(active == 'package') {
                    formData.append('service_list', JSON.stringify(selectedService));
                    formData.append('switch', 'package');
                }
                else if(active == 'service') {
                    formData.append('therapist_list', JSON.stringify(selectedTherapist));
                    formData.append('room_list', JSON.stringify(selectedRoom));
                    formData.append('switch', 'service');
                    formData.append('is_standalone', packages.is_standalone ? '1' : '0');
                }

                // for (const [key, value] of formData.entries()) {
                //     console.log(key, value);
                // }

                // CREATE data
                try {
                    await api.post(`/package`, formData);

                    if(active == 'package') 
                        fetchData_package()
                    else if(active == 'service') 
                        fetchData_service()

                    setForm_package(false)
                }
                catch(error) {
                    console.error('Error:', error); // use only to remove warning on vscode
                    // console.error('Response:', error.response?.data);
                }
                finally {
                    setIsLoading(false)
                }
            }
            
            // EDIT service
            const handleEdit_package = (data: any) => {
                console.log('data = ',data)
            }
            // DELETE service
            const handleDelete_package = (id: number) => {
                console.log('id = ',id)
            }
        //#endregion


        // #region 4) --> database

            // package
            const [databasePackage, setDatabase_package] = useState<Package_json[]>([])
            const fetchData_package = useCallback(() => {
                api.get(`/package`, {
                    params: {
                        switch: 'package'
                    }
                })
                .then((response) => {
                    // 1) normal
                    setDatabase_package(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error.data);
                });
            }, [])

            
            // service
            const [databaseService, setDatabase_service] = useState<Service_json[]>([])
            const fetchData_service = useCallback(() => {
                api.get(`/package`, {
                    params: {
                        switch: 'service'
                    }
                })
                .then((response) => {
                    // 1) normal
                    setDatabase_service(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error.data);
                });
            }, [])

        //#endregion
    
    //#endregion
    

    //#region 3 --> setting

        // #region a) --> category
            // #region 1) --> useState
                // form
                const [form_category, setForm_category] = useState(false);
                // fieldname
                const [category, setCategory] = useState<Package_category_type>({
                    id: 0,
                    name: ''
                });
            //#endregion

            // #region 2) --> method
                // CREATE
                const handleCreate_category= async() => {

                    // loading
                    setIsLoading(true)
                    try {
                        await api.post(`/package`, {
                            name: category.name,

                            switch: 'category'
                        });

                        fetchData_category()
                        setForm_category(false)
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

            // #region 3) --> database
                
                // database
                const [databaseCategory, setDatabase_category] = useState<Package_category_type[]>([])
                // fetch database
                const fetchData_category = useCallback(() => {
                    api.get(`/package`, {
                        params: {
                            switch: 'category'
                        }
                    })
                    .then((response) => {
                        // console.log('data = ', response.data)
                        setDatabase_category(response.data);

                        // set data (KIV)
                        setPackages(prev => ({
                            ...prev,
                            package_category_id: response.data[0].id
                        }))
                    })
                    .catch((error) => {
                        console.error('Error fetching:', error);
                    });
                }, []);
                
                // tableTitle_category
                const tableTitle_category: Column<Package_category_type>[] = [
                    {
                        key: "name",
                        header: "Name",
                        render: (row) => row.name
                    },
                    {
                        key: "",
                        header: "Action",
                        render: () => (
                            <div className="flex gap-3">
                                <button className="border border-border p-1 px-2 text-black text-sm rounded-md cursor-pointer">
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
                    if(!form_category) {
                        setCategory({
                            id: 0,
                            name: ''
                        })
                    }
                }, [form_category])
            //#endregion

        //#endregion

        // #region b) --> room

            // #region 1) --> useState
                // form
                const [form_room, setForm_room] = useState(false);
                // fieldname
                const [room, setRoom] = useState("");
                const [description, setDescription] = useState("");
                // database
                const [databaseRoom, setDatabase_room] = useState<Room_type[]>([])
                // for detecting error
                const [errorRoom, setError_room] = useState<Partial<Record<keyof Room_type, string>>>({});
            //#endregion

            // #region 2) --> method
                // edit
                const editRoom = (item: Room_type) => {
                    setRoom(item.name)
                    setDescription(item.description)
                    
                    setCrud('edit')
                    setForm_room(true)
                }
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

            // #region 3) --> database
                // tableTitle_room
                const tableTitle_room: Column<Room_type>[] = [
                    { key: "name", header: "Room" },
                    { key: "description", header: "Description" },
                    {
                        key: "",
                        header: "Action",
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
                // remove fieldname everytime form closed
                useEffect(() => {
                    if(!form_room) {
                        setRoom('')
                        setDescription('')
                        setError_room({})
                    }
                }, [form_room])
            //#endregion

        //#endregion

    //#endregion


    return (
        <>

            {/* #region 0 --> main */}
            <>
                <Grid className="md:grid-cols-4">
                    <Tabs className="col-span-2 grid grid-cols-3" tabs={tabs} active={active} setActive={setActive} />
                </Grid>
            </>

            {/* #region 1 --> package */}
            {active == 'package' && (
                <>
                    {/* Create */}
                    <Grid className="md:grid-cols-5 items-center">
                        <Label>{databasePackage.length} Package</Label>
                        <Button onClick={()=> {setForm_package(true); setCrud('create')}} icon={Plus} label='Add Package' className="md:col-start-5"/>
                    </Grid>
                    
                    <Grid className="md:grid-cols-2">
                        {databasePackage.map((data) => (
                            <PackageCard
                                key={data.package.id}
                                poster={data.package.poster}
                                title={data.package.title}
                                description={data.package.description}
                                price={data.package.price}
                                duration={data.package.duration}
                                onEdit={() => handleEdit_package(data.package)}
                                onDelete={() => handleDelete_package(data.package.id)}
                            />
                        ))}
                    </Grid>
                </>  
            )}

            {/* #region 2 --> service */}
            {active == 'service' && (
                <>
                    {/* Create */}
                    <Grid className="md:grid-cols-5 items-center">
                        <Label>{databaseService.length} Service</Label>
                        <Button onClick={()=> {setForm_package(true); setCrud('create')}} icon={Plus} label='Add Service' className="md:col-start-5"/>
                    </Grid>
                    
                    <Grid className="md:grid-cols-2">
                        {databaseService.map((data) => (
                            <PackageCard
                                key={data.service.id}
                                poster={data.service.poster}
                                title={data.service.title}
                                description={data.service.description}
                                price={data.service.price}
                                duration={data.service.duration}
                                category={data.package_category.name}
                                onEdit={() => handleEdit_package(data.service)}
                                onDelete={() => handleDelete_package(data.service.id)}
                            />
                        ))}
                    </Grid>
                </>  
            )}
    
            {/* #region 3 --> setting */}
            {active == 'setting' && (
                <>

                    {/* a) category */}
                    <>
                        {/* Create */}
                        <Grid className="md:grid-cols-5 items-center">
                            <Label>{databaseCategory.length} Category</Label>
                            <Button onClick={() => { setForm_category(true); setCrud('create')}} icon={Plus} label='Add Category' className="md:col-start-5"/>
                        </Grid>

                        {/* table */}
                        <Grid>
                            <Table fieldName={tableTitle_category} data={databaseCategory}  />
                        </Grid>

                        {/* create category */}
                        <Form title={crud=='create'? 'Add Category':'Edit Category'} isOpen={form_category} onClose={() => setForm_category(false)} width="max-w-lg"
                            
                            footer={
                                <>
                                    <Button
                                        label="Cancel"
                                        className="w-24"
                                        onClick={() => setForm_category(false)}
                                        disabled={isLoading}
                                    />

                                    {crud == 'create' ? (
                                        <Button
                                            label="Save"
                                            className="w-24"
                                            onClick={handleCreate_category}
                                            disabled={isLoading}
                                        />
                                    ) : (

                                        <Button
                                            label="Update"
                                            className="w-24"
                                            onClick={handleCreate_category}
                                            disabled={isLoading}
                                        />
                                    )}

                                </>
                            }
                        >
                            <div className="space-y-4">
                                <Field
                                    label="Name"
                                    placeholder="Body Message, Facial, ..."
                                    value={category.name}
                                    onChange={(e) => setCategory({...category, name:e.target.value})}
                                />
                            </div>
                        </Form>
                        
                    </>
                    {/* b) room */}
                    <>
                        {/* Create */}
                        <Grid className="md:grid-cols-5 items-center">
                            <Label>{databaseRoom.length} Room</Label>
                            <Button onClick={() => {setForm_room(true); setCrud('create')}} icon={Plus} label='Add Room' className="md:col-start-5"/>
                        </Grid>

                        {/* table */}
                        <Grid>
                            <Table fieldName={tableTitle_room} data={databaseRoom}  />
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
                </>
            )}

            {/* Form for both package + service */}
            <Form title={crud=='create'? `Add  ${active=='package'? 'Package': 'Service'}`:`Edit ${active=='package'? 'Package': 'Service'}`} isOpen={form_package} onClose={() => setForm_package(false)} width="max-w-3xl"
                
                footer={
                    <>
                        <Button
                            label="Cancel"
                            className="w-24"
                            onClick={() => setForm_package(false)}
                            disabled={isLoading}
                        />

                        {crud == 'create' ? (
                            <Button
                                label="Save"
                                className="w-24"
                                onClick={handleCreate_package}
                                disabled={isLoading}
                            />
                        ) : (
                            <Button
                                label="Update"
                                className="w-24"
                                onClick={handleCreate_package}
                                disabled={isLoading}
                            />
                        )}

                    </>
                }
            >
                <div className="space-y-4">
                    {/* (0+1+2+3+4+5+6+7) reusable form */}
                   
                    <Grid className="md:grid-cols-2">

                        {/* 1) */}
                        <div className="col-span-2">
                            <Field
                                label="Poster"
                                placeholder="Set a poster"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];

                                    if (file) {
                                        setPackages({
                                            ...packages,
                                            poster: file,
                                        });

                                        setPosterPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />

                            {posterPreview && (
                                <div className="mt-3">
                                    <img
                                        src={posterPreview}
                                        alt="Poster preview"
                                        className="w-48 h-48 object-cover rounded-lg border"
                                    />
                                </div>
                            )}
                        </div>

                        {/* 2) */}
                        <Field
                            label="Title"
                            placeholder="Enter a title"
                            value={packages.title}
                            onChange={(e) =>
                                setPackages({
                                    ...packages,
                                    title: e.target.value,
                                })
                            }
                        />
                    
                        {/* 3) */}
                        <Field
                            label="Category"
                            value={packages.package_category_id}
                            onChange={(e) => setPackages({ ...packages, package_category_id: Number(e.target.value)})}
                            type="select"
                            options={
                                databaseCategory.map((category:any) => ({
                                    label: category.name,
                                    value: category.id
                                }))
                            }
                        />

                        {/* 4) */}
                        <Field
                            label="Duration (minutes)"
                            placeholder="Set duration in minute"
                            value={packages.duration}
                            onChange={(e) =>
                                setPackages({
                                    ...packages,
                                    duration: e.target.value === ""
                                        ? ""
                                        : Number(e.target.value),
                                })
                            }
                            type="number"
                            disabled
                        />

                        {/* 5)e */}
                        <Field
                            label="Price (RM)"
                            placeholder="Enter price"
                            value={packages.price}
                            onChange={(e) =>
                                setPackages({
                                    ...packages,
                                    price: e.target.value === ""
                                        ? ""
                                        : Number(e.target.value),
                                })
                            }
                            type="number"
                        />

                        {/* 6) */}
                        <Field
                            label="Gender"
                            placeholder="Select a gender"
                            value={packages.gender}
                            onChange={(e) =>
                                setPackages({
                                    ...packages,
                                    gender: e.target.value,
                                })
                            }
                            type="select"
                            options={[
                                { label: "Man", value: "man" },
                                { label: "Woman", value: "woman" },
                                { label: "Unisex", value: "unisex" },
                                { label: "Couple", value: "couple" },
                            ]}
                        />

                        {/* 7) */}
                        <div className="cols-span-2">
                            <Field
                                label="Description"
                                placeholder="Enter a description"
                                value={packages.description}
                                onChange={(e) =>
                                    setPackages({
                                        ...packages,
                                        description: e.target.value,
                                    })
                                }
                                type="textarea"
                            />
                        </div>

                        
                        {/* 8) / Optional */}
                        {active == 'service' && (
                            <div className="col-span-2">
                                <Field
                                    label="Available as Standalone Service?"
                                    value={packages?.is_standalone || ''}
                                    onChange={(e) => setPackages({ ...packages, is_standalone: e.target.value == 'true'})}
                                    type="select"
                                    options={[
                                        { label:'Yes', value: 'true'},
                                        { label:'No', value: 'false'},
                                    ]}
                                />
                            </div>
                        )}

                        {/* 9) Details / What to expect */}
                        <div className="col-span-2">
                            <span className="text-sm text-title font-medium block mb-1.5">What To Expect</span>
                            <TextEditor
                                onChange={(value) => setPackages({
                                    ...packages,
                                    detail: value
                                })}
                            />
                        </div>

                    </Grid>

                    {/* Situational */}
                    {active == 'package' ? (
                        <Grid>
                            
                            {/* 10) Service */}
                            <MultiSelect
                                label="Service"
                                options={databaseService.map((service) => ({
                                    id: service.service?.id || 0,
                                    name: service.service.title,
                                    // description: service.service.description,
                                    price: service.service.price, 
                                    gender: service.service.gender,
                                    type: service.package_category.name,
                                    duration: service.service.duration,
                                }))}
                                selected={selectedService}
                                onChange={setSelected_service}
                            />
                        </Grid>
                    ) : (
                        <Grid className="md:grid-cols-2">
                            {/* 11) Therapist */}
                            <MultiSelect
                                label="Therapist"
                                options={databaseTherapist.map((therapist) => ({
                                    id: therapist?.id || 0,
                                    name: therapist.name,
                                    description: therapist.specialty,
                                }))}
                                selected={selectedTherapist}
                                onChange={setSelected_therapist}
                            />
                            {/* 12) Room */}
                            <MultiSelect
                                label="Room"
                                options={databaseRoom.map((room) => ({
                                    id: room.id,
                                    name: room.name,
                                    description: room.description
                                }))}
                                selected={selectedRoom}
                                onChange={setSelected_room}
                            />
                        </Grid>
                    )}
                </div>
            </Form>
        </>
    )
}

export default Packages;