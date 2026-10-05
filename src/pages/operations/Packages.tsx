import { Package, Plus, Settings, Sparkles } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import { useCallback, useEffect, useState } from "react";
import Form from "../../components/ui/Form";
import api from "../../api/axios";
import Field from "../../components/ui/Field";
import { type Service_category_type, type Package_json, type Package_type, type Service_json } from "../../interface/package";
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


// #region 0) b) --> Package + Service form

    interface PackageFormProps {
        data: Package_type;
        setData: React.Dispatch<React.SetStateAction<Package_type>>;
        posterPreview: string | null;
        setPosterPreview: React.Dispatch<React.SetStateAction<string | null>>;
        setContent: React.Dispatch<React.SetStateAction<string>>;
        databaseCategory?: Service_category_type[]
    }

    function PackageForm({ data, setData, posterPreview, setPosterPreview, setContent, databaseCategory }: PackageFormProps) {
        return (
            <>
                <Grid className="md:grid-cols-2">
                    {/* 0) Standalone / Optional */}
                    {databaseCategory && (
                        <>
                            <Field
                                label="Available as Standalone Service?"
                                value={data.is_standalone}
                                onChange={(e) => setData({ ...data, is_standalone: e.target.value == 'true'})}
                                type="select"
                                options={[
                                    { label:'Yes', value: 'true'},
                                    { label:'No', value: 'false'},
                                ]}
                            />
                        
                        <Field
                            label="Category"
                            value={data.service_category_id}
                            onChange={(e) => setData({ ...data, service_category_id: Number(e.target.value)})}
                            type="select"
                            options={
                                databaseCategory.map((category:any) => ({
                                    label: category.name,
                                    value: category.id
                                }))
                            }
                        />
                        </>
                    )}

                    {/* 1) Poster */}
                    <div className="col-span-2">
                        <Field
                            label="Poster"
                            placeholder="Set a poster"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (file) {
                                    setData({
                                        ...data,
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

                    {/* 2) Title */}
                    <Field
                        label="Title"
                        placeholder="Enter a title"
                        value={data.title}
                        onChange={(e) =>
                            setData({
                                ...data,
                                title: e.target.value,
                            })
                        }
                    />

                    {/* 3) Duration */}
                    <Field
                        label="Duration (minutes)"
                        placeholder="Set duration in minute"
                        value={data.duration}
                        onChange={(e) =>
                            setData({
                                ...data,
                                duration: e.target.value === ""
                                    ? ""
                                    : Number(e.target.value),
                            })
                        }
                        type="number"
                    />

                    {/* 4) Price */}
                    <Field
                        label="Price (RM)"
                        placeholder="Enter price"
                        value={data.price}
                        onChange={(e) =>
                            setData({
                                ...data,
                                price: e.target.value === ""
                                    ? ""
                                    : Number(e.target.value),
                            })
                        }
                        type="number"
                    />

                    {/* 5) Gender */}
                    <Field
                        label="Gender"
                        placeholder="Select a gender"
                        value={data.gender}
                        onChange={(e) =>
                            setData({
                                ...data,
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

                    {/* 6) Description */}
                    <div className="cols-span-2">
                        <Field
                            label="Description"
                            placeholder="Enter a description"
                            value={data.description}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    description: e.target.value,
                                })
                            }
                            type="textarea"
                        />
                    </div>

                    {/* 7) Details / What to expect */}
                    <div className="col-span-2">
                        <span className="text-sm text-title font-medium block mb-1.5">What To Expect</span>
                        <TextEditor onChange={setContent} />
                    </div>
                </Grid>
            </>
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
        const [active, setActive] = useState("package");
        const tabs = [
            { id: "package", label: "Package", icon: Package },
            { id: "service", label: "Service", icon: Sparkles },
            { id: "setting", label: "Setting", icon: Settings },
        ];
        useEffect(() => {
            switch(active) {
                case 'package': 
                break;
                case 'service': 
                    fetchData_service()
                break;
                case 'room': 
                break;
            }
        },[active])

        
        // fetch database by default
        useEffect(() => {
            fetchData_therapist()
            fetchData_room()
            fetchData_category()
        }, [])
    //#endregion


    //#region 1) --> package
   
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
            })
            // preview poster
            const [posterPreview_package, setPosterPreview_package] = useState<string | null>(null);
            // content / details
            const [detail_package, setDetail_package] = useState('');
            // form
            const [form_package, setForm_package] = useState(false);
            const [selectedService, setSelected_service] = useState<number[]>([]);
            const [databaseService_standalone, setDatabase_serviceStandalone] = useState<Service_json[]>([])
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
                    })
                }
                setPosterPreview_package(null)
            }, [form_package])

        //#endregion

        // #region 3) --> method
            // CREATE package
            const handleCreate_package = async () => {
                // loading
                setIsLoading(true)

                console.log('data = ',packages)

                // format data to allow image uploading
                const formData = new FormData();

                if(packages.poster)
                    formData.append('poster', packages.poster);

                formData.append('title', packages.title);
                formData.append('description', packages.description);
                formData.append('duration', packages.duration.toString());
                formData.append('price', packages.price.toString());
                formData.append('gender', packages.gender);
                formData.append('detail', JSON.stringify(detail_package));

                formData.append('service_list', JSON.stringify(selectedService));

                formData.append('switch', 'package');

                // for (const [key, value] of formData.entries()) {
                //     console.log(key, value);
                // }

                // CREATE data
                try {
                    await api.post(`/package`, formData);

                    // fetchData_package()
                    // setForm_package(false)
                }
                catch(error) {
                    console.error('Error:', error); // use only to remove warning on vscode
                    console.error('Response:', error.response?.data);
                }
                finally {
                    setIsLoading(false)
                }
            }
        //#endregion

        // #region 4) --> database

            // a) therapist
            const [databaseTherapist, setDatabase_therapist] = useState<User_type[]>([])
            // c) package
            const [databasePackage, setDatabase_package] = useState<Package_json[]>([])

            // a) therapist
            const fetchData_therapist = useCallback(() => {

                api.get(`/user`, {
                    params: {
                        role: 'therapist'
                    }
                })
                .then((response) => {
                    setDatabase_therapist(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
            }, [])
            // c) package
            const fetchData_package = useCallback(() => {
                api.get(`/package`)
                .then((response) => {

                    setDatabase_package(response.data)
                    // console.log('data = ',response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
            }, [])

        //#endregion
    
    //#endregion


    //#region 2) --> service
   
        // #region 1) --> useState
            // fieldname
            const [services, setServices] = useState<Package_type> ({
                id: 0,
                poster: null,
                title: '',
                description: '',
                duration: 0,
                price: 0,
                gender: '',

                service_category_id: 0,
                is_standalone: true,
            })
            // content / details
            const [detail_service, setDetail_service] = useState('');
            // preview poster
            const [posterPreview_service, setPosterPreview_service] = useState<string | null>(null);
            // form
            const [form_service, setForm_service] = useState(false);
            const [selectedTherapist, setSelected_therapist] = useState<number[]>([]);
            const [selectedRoom, setSelected_room] = useState<number[]>([]);
        //#endregion

        // #region 3) --> method
            // CREATE package
            const handleCreate_service = async () => {
                // loading
                setIsLoading(true)

                // console.log('data = ',services)

                // format data to allow image uploading
                const formData = new FormData();

                if(services.poster)
                    formData.append('poster', services.poster);

                formData.append('title', services.title);
                formData.append('description', services.description);
                formData.append('duration', services.duration.toString());
                formData.append('price', services.price.toString());
                formData.append('gender', services.gender);
                formData.append('detail', JSON.stringify(detail_service));
                formData.append('service_category_id', services.service_category_id?.toString() || '');
                formData.append('is_standalone', services.is_standalone ? '1' : '0');

                formData.append('therapist_list', JSON.stringify(selectedTherapist));
                formData.append('room_list', JSON.stringify(selectedRoom));

                formData.append('switch', 'service');

                // for (const [key, value] of formData.entries()) {
                //     console.log(key, value);
                // }

                // CREATE data
                try {
                    await api.post(`/package`, formData);

                    fetchData_service()
                    setForm_service(false)
                }
                catch(error) {
                    console.error('Error:', error); // use only to remove warning on vscode
                    // console.error('Response:', error.response?.data);
                }
                finally {
                    setIsLoading(false)
                }
            }
        //#endregion

        // #region 4) --> database

            // c) package
            const [databaseService, setDatabase_service] = useState<Service_json[]>([])

            // c) package
            const fetchData_service = useCallback(() => {
                api.get(`/package`, {
                    params: {
                        switch: 'service'
                    }
                })
                .then((response) => {
                    console.log('data = ',response.data)
                    // 1) normal
                    setDatabase_service(response.data)

                    // 2) if standalone only
                    const standaloneServices = response.data.filter((item: any) => item.service?.is_standalone == 1);
                    setDatabase_serviceStandalone(standaloneServices);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error.data);
                });
            }, [])

            useEffect(()=> {
                fetchData_service()
            }, []) 

        //#endregion
        
    //#endregion
    

    //#region 3 --> setting

        // #region a) --> category

            // #region 1) --> useState
                // form
                const [form_category, setForm_category] = useState(false);
                // fieldname
                const [category, setCategory] = useState<Service_category_type>({
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

                            switch: 'service_category'
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
                const [databaseCategory, setDatabase_category] = useState<Service_category_type[]>([])
                // fetch database
                const fetchData_category = useCallback(() => {
                    api.get(`/package`, {
                        params: {
                            switch: 'service_category'
                        }
                    })
                    .then((response) => {
                        // console.log('data = ', response.data)
                        setDatabase_category(response.data);

                        // set data (KIV)
                        setServices(prev => ({
                            ...prev,
                            service_category_id: response.data[0].name
                        }))
                    })
                    .catch((error) => {
                        console.error('Error fetching:', error);
                    });
                }, []);
                
                // tableTitle_category
                const tableTitle_category: Column<Service_category_type>[] = [
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

                    {/* Form */}
                    <Form title={crud=='create'? 'Add Package':'Edit Package'} isOpen={form_package} onClose={() => setForm_package(false)} width="max-w-3xl"
                        
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
                            {/* (1+2+3+4+5+6+7) reusable form */}
                            <PackageForm
                                data={packages}
                                setData={setPackages}
                                posterPreview={posterPreview_package}
                                setPosterPreview={setPosterPreview_package}
                                setContent={setDetail_package}
                            />
                        </div>
                        <Grid>
                            {/* 8) Service */}
                            <MultiSelect
                                label="Service"
                                options={databaseService_standalone.map((service) => ({
                                    id: service.service?.id || 0,
                                    name: service.service.title,
                                    // description: service.service.description,
                                    price: service.service.price, 
                                    gender: service.service.gender,
                                    type: service.service_category.name,
                                    duration: service.service.duration,
                                }))}
                                selected={selectedService}
                                onChange={setSelected_service}
                            />
                        </Grid>

                    </Form>
                </>  
            )}

            {/* #region 2 --> service */}
            {active == 'service' && (
                <>
                    {/* Create */}
                    <Grid className="md:grid-cols-5 items-center">
                        <Label>{databaseService.length} Service</Label>
                        <Button onClick={()=> {setForm_service(true); setCrud('create')}} icon={Plus} label='Add Service' className="md:col-start-5"/>
                    </Grid>
                    
                    <Grid className="md:grid-cols-2">
                        {databaseService.map((data) => (
                            <div key={data.service.id} className="flex w-full flex-col rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
                                {/* Poster */}
                                <div className="mb-5 h-48 w-full overflow-hidden rounded-2xl">
                                    <img
                                        src={`http://localhost:8000/${data.service.poster}`}
                                        alt={data.service.title}
                                        className="h-full w-full"
                                    />
                                </div>
                            
                                {/* Header */}
                                <div className="flex h-8 items-center justify-between">
                                    <span className="whitespace-nowrap rounded-full bg-tertiary px-3 py-1.5 text-xs font-bold tracking-wide text-title uppercase">
                                        {data.service_category.name}
                                    </span>

                                    <span className="text-lg font-bold">
                                        RM {data.service.price}
                                    </span>
                                </div>

                                {/* Title */}
                                <div className="mt-3 h-6">
                                    <h2 className="text-base font-serif font-bold text-stone-900 uppercase">
                                        {data.service.title}
                                    </h2>
                                </div>

                                {/* Description */}
                                <div className="mt-3 flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-title font-semibold">
                                            {data.service.description.length > 150 ? (
                                                `${data.service.description.slice(0, 150)}...`
                                            ) : ( 
                                                data.service.description
                                            )}
                                        </span>
                                    </div>
                                </div>
                                

                                {/* Duration */}
                                <div className="mt-3">
                                    <span className="text-xs font-semibold text-title">
                                        {data.service.duration} min
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="mt-3 flex gap-3">
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

                    {/* Form */}
                    <Form title={crud=='create'? 'Add Service':'Edit Service'} isOpen={form_service} onClose={() => setForm_service(false)} width="max-w-3xl"
                        
                        footer={
                            <>
                                <Button
                                    label="Cancel"
                                    className="w-24"
                                    onClick={() => setForm_service(false)}
                                    disabled={isLoading}
                                />

                                {crud == 'create' ? (
                                    <Button
                                        label="Save"
                                        className="w-24"
                                        onClick={handleCreate_service}
                                        disabled={isLoading}
                                    />
                                ) : (
                                    <Button
                                        label="Update"
                                        className="w-24"
                                        onClick={handleCreate_service}
                                        disabled={isLoading}
                                    />
                                )}

                            </>
                        }
                    >
                        <div className="space-y-4">
                            {/* (0+1+2+3+4+5+6+7) reusable form */}
                            <PackageForm
                                data={services}
                                setData={setServices}
                                posterPreview={posterPreview_service}
                                setPosterPreview={setPosterPreview_service}
                                setContent={setDetail_service}
                                databaseCategory={databaseCategory}
                            />

                            <Grid className="md:grid-cols-2">
                                {/* 9) Therapist */}
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
                                {/* 10) Room */}
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
                        </div>
                    </Form>
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
        </>
    )
}

export default Packages;