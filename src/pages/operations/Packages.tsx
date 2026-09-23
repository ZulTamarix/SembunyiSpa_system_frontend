import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import { useCallback, useEffect, useState } from "react";
import Form from "../../components/ui/Form";
import api from "../../api/axios";
import Field from "../../components/ui/Field";
import type { Package_json, Package_type } from "../../interface/package";
import type { User_therapist_json } from "../../interface/user";
import type { Room_type } from "../../interface/room";
import Bullet_point from "../../components/ui/Bullet_point";

// #region 0) --> Multi select

    interface MultiSelectOption {
        id: number;
        name: string;
        description?: string;
    }
    interface MultiSelectProps {
        label: string;
        options: MultiSelectOption[];
        selected: string[];
        onChange: (selected: string[]) => void;
    }

    function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {

        const toggleOption = (id: string) => {
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
                                <label key={option.id} className="flex items-center gap-3 px-3 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition hover:bg-gray-100">
                                    {/* Click */}
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleOption(option.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-border focus:ring-border"
                                    />

                                    {/* Label */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-title">
                                            {option.name}
                                        </p>

                                        {option.description && (
                                            <p className="text-xs text-secondary">
                                                {option.description}
                                            </p>
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


const Packages: React.FC = () => {

    // #region 1) --> useState
        // fieldname
        const [packages, setPackages] = useState<Package_type> ({
            id: 0,
            poster: null,
            title: '',
            type: '',
            description: '',
            duration: 0,
            price: 0,
            gender: '',
        })
        // preview poster
        const [posterPreview, setPosterPreview] = useState<string | null>(null);
        // details
        const [details, setDetails] = useState<string[]>([""]);
        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        const [isLoading, setIsLoading] = useState(false);
        // form
        const [form, setForm] = useState(false);
    //#endregion


    // #region 2) --> useEffect
        // reset fieldname everytime form closed
        useEffect(() => {
            if(!form) { 
                setPackages ({
                    id: 0,
                    poster: null,
                    title: '',
                    type: '',
                    description: '',
                    duration: 0,
                    price: 0,
                    gender: '',
                })
                setDetails([''])
            }
            setPosterPreview(null)
        }, [form])

    //#endregion


    // #region 3) --> method
        // CREATE package
        const handleCreate_package = async () => {
            // loading
            setIsLoading(true)

            // clean any blank or ""
            const details_cleaned = details.filter(detail => detail !== "");

            // format data to allow image uploading
            const formData = new FormData();

            if(packages.poster)
                formData.append('poster', packages.poster);

            formData.append('title', packages.title);
            formData.append('type', packages.type);
            formData.append('description', packages.description);
            formData.append('duration', packages.duration.toString());
            formData.append('price', packages.price.toString());
            formData.append('gender', packages.gender);

            formData.append('detail_list', JSON.stringify(details_cleaned));
            formData.append('therapist_list', JSON.stringify(selectedTherapist));
            formData.append('room_list', JSON.stringify(selectedRoom));

            // CREATE data
            try {
                await api.post('/package', formData);

                fetchData_package()
                setForm(false)
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

        // a) therapist
        const [databaseTherapist, setDatabase_therapist] = useState<User_therapist_json[]>([])
        const [selectedTherapist, setSelectedTherapist] = useState<string[]>([]);
        // b) room
        const [databaseRoom, setDatabase_room] = useState<Room_type[]>([])
        const [selectedRoom, setSelectedRoom] = useState<string[]>([]);
        // c) package
        const [databasePackage, setDatabase_package] = useState<Package_json[]>([])

        // a) therapist
        const fetchData_therapist = useCallback(() => {

            api.get('/user', {
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
        // b) room
        const fetchData_room = useCallback(() => {
            api.get('/room')
            .then((response) => {
                setDatabase_room(response.data)
                // console.log('data = ',response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }, [])
        // c) package
        const fetchData_package = useCallback(() => {
            api.get('/package')
            .then((response) => {

                setDatabase_package(response.data)
                // console.log('data = ',response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }, [])

        // fetch database
        useEffect(() => {
            fetchData_therapist()
            fetchData_room()
            fetchData_package()
        }, [])
    //#endregion


    return (
        <>
            {/* Create */}
            <Grid className="md:grid-cols-5 items-center">
                <span className="text-title">{databasePackage.length} packages</span>
                <Button onClick={()=> {setForm(true); setCrud('create')}} icon={Plus} label='Add Package' className="md:col-start-5"/>
            </Grid>
            
            {/* Table */}
            <Grid className="md:grid-cols-2">
                {databasePackage.map((data) => (
                  <div key={data.package.id} className="flex w-full flex-col rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
                        {/* Poster */}
                        
                       
                        {/* Header */}
                        <div className="flex h-8 items-center justify-between">
                            <span className="whitespace-nowrap rounded-full bg-tertiary px-3 py-1.5 text-xs font-bold tracking-wide text-title uppercase">
                                {data.package.type}
                            </span>

                            <span className="text-lg font-bold">
                                RM {data.package.price}
                            </span>
                        </div>

                        {/* Title */}
                        <div className="mt-3 h-6">
                            <h2 className="text-base font-serif font-bold text-stone-900 uppercase">
                                {data.package.title}
                            </h2>
                        </div>

                        {/* Description */}
                        <div className="mt-3 flex-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-title font-semibold">
                                    {data.package.description.length > 150 ? (
                                        `${data.package.description.slice(0, 150)}...`
                                    ) : ( 
                                        data.package.description
                                    )}
                                </span>
                            </div>
                        </div>
                        

                        {/* Duration */}
                        <div className="mt-3">
                            <span className="text-xs font-semibold text-title">
                                {data.package.duration} min
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
            <Form title={crud=='create'? 'Add Package':'Edit Package'} isOpen={form} onClose={() => setForm(false)} width="max-w-3xl"
                
                footer={
                    <>
                        <Button
                            label="Cancel"
                            className="w-24"
                            onClick={() => setForm(false)}
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
                                            poster: file
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
                                        className="w-48 h-48 object-cover rounded-lg border col-span-2"
                                    />
                                </div>
                            )}
                        </div>
                        {/* 2) */}
                        <Field
                            label="Title"
                            placeholder="Enter a title"
                            value={packages.title}
                            // error={error}
                            onChange={(e) => setPackages({ ...packages,title : e.target.value })}
                        />
                        {/* 3) */}
                        <Field
                            label="Type"
                            placeholder="Set package's type"
                            value={packages.type}
                            // error={error}
                            onChange={(e) => setPackages({ ...packages, type: e.target.value })}
                        />
                        {/* 4) */}
                        <Field
                            label="Duration"
                            placeholder="Set duration in minute"
                            value={packages.duration}
                            // error={error}
                            onChange={(e) => setPackages({ ...packages, duration: Number(e.target.value) })}
                            type="number"
                        />
                        {/* 5) */}
                        <Field
                            label="Price"
                            placeholder="Enter price"
                            value={packages.price}
                            // error={error}
                            onChange={(e) => setPackages({ ...packages, price: Number(e.target.value) })}
                            type="number"
                        />
                        {/* 6) */}
                        <Field
                            label="Gender"
                            placeholder="Select a gender"
                            value={packages.gender}
                            // error={error}
                            onChange={(e) => setPackages({ ...packages, gender: e.target.value })}
                            type="select"
                            options={[
                                { label: 'Man', value: 'man' },
                                { label: 'Woman', value: 'woman' },
                                { label: 'Unisex', value: 'unisex' },
                                { label: 'Couple', value: 'couple' },
                            ]}
                        />

                        {/* 7) */}
                        <Field
                            label="Description"
                            placeholder="Enter a description"
                            value={packages.description}
                            // error={error}
                            onChange={(e) => setPackages({ ...packages, description: e.target.value })}
                            type="textarea"
                        />
                        {/* 8) Detail */}
                        <div className="col-span-2">
                            <Bullet_point
                                value={details}
                                onChange={setDetails}
                                label="Package's details"
                            />
                        </div>
                        {/* 9) Therapist */}
                        <MultiSelect
                            label="Therapist"
                            options={databaseTherapist.map((therapist) => ({
                                id: therapist.user_therapist.id,
                                name: therapist.user.name,
                                description: therapist.user_therapist.position
                            }))}
                            selected={selectedTherapist}
                            onChange={setSelectedTherapist}
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
                            onChange={setSelectedRoom}
                        />
                   </Grid>
                </div>
            </Form>
        </>
    )
}

export default Packages;