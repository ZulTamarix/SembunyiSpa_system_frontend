import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Form from "../../components/ui/Form";
import Grid from "../../components/ui/Grid";
import Label from "../../components/ui/Label";
import type { Banner_type } from "../../interface/banner";
import { getCurrentDate } from "../../utils/date";
import Field from "../../components/ui/Field";
import api from "../../api/axios";

const Banners: React.FC = () => {
    
    // #region 1) --> useState
        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        const [isLoading, setIsLoading] = useState(false);
        // form
        const [form_banner, setForm_banner] = useState(false);
        // fieldname
        const [banner, setBanner] = useState<Banner_type> ({
            id: 0,
            poster: null,
            title: '',
            description: '',
            status: 'active',
            date_expired: getCurrentDate()
        })
        const [posterPreview_banner, setPosterPreview_banner] = useState<string | null>(null);

    //#endregion
    // #region 3) --> method
        const handleCreate_banner = async () => {

            // loading
            setIsLoading(true)

            // format data to allow image uploading
            const formData = new FormData();

            if(banner.poster)
                formData.append('poster', banner.poster);

            formData.append('title', banner.title);
            formData.append('description', banner.description);
            formData.append('status', banner.status);
            formData.append('date_expired', banner.date_expired);

            // for (const [key, value] of formData.entries()) {
            //     console.log(key, value);
            // }

            // CREATE data
            try {
                await api.post(`/banner`, formData);

                fetchData_banner()
                setForm_banner(false)
            }
            catch(error) {
                console.error('Error:', error); // use only to remove warning on vscode
                // console.error('Response:', error.response?.data);
            }
            finally {
                setIsLoading(false)
            }
        }
        
            // EDIT package
            const handleEdit_banner = (data: any) => {
            }
            // DELETE package
            const handleDelete_banner = (id: number) => {
            }
    //#endregion
    // #region 4) --> database

        // c) banner
        const [databaseBanner, setDatabase_banner] = useState<Banner_type[]>([])
        const fetchData_banner = useCallback(() => {
            api.get(`/banner`)
            .then((response) => {
                // 1) normal
                setDatabase_banner(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error.data);
            });
        }, [])
        useEffect(()=> {
            fetchData_banner()
        }, []) 

    //#endregion

    return (
        <>
            {/* Create */}
            <Grid className="md:grid-cols-5 items-center">
                <Label>{databaseBanner.length} Banner</Label>
                <Button onClick={() => { setForm_banner(true); setCrud('create')}} icon={Plus} label='Upload Banner' className="md:col-start-5"/>
            </Grid>          
            
            {/* Table */}
            <Grid className="md:grid-cols-2">
                {databaseBanner.map((data) => (
                    <div className="flex w-full flex-col rounded-[28px] border border-stone-200 bg-white shadow-sm">
                        <div className="relative mb-2 h-48 w-full overflow-hidden rounded-t-2xl">
                            {/* Poster */}
                            <img
                                src={`http://localhost:8000/${data.poster}`}
                                alt={data.title}
                                className="h-full w-full"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                                {/* Title */}
                                <h2 className="text-sm font-serif font-bold text-white uppercase">
                                    {data.title}
                                </h2>

                                {/* Description */}
                                <span className="text-xs text-white">
                                    {data.description.length > 150
                                        ? `${data.description.slice(0, 150)}...`
                                        : data.description}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        {/* <div className="flex items-center justify-between "> */}
                        <div className="flex items-center justify-between px-5 pb-2">
                            {/* Status */}
                            <span className={`rounded-full border border-border px-4 py-1 text-sm font-semibold transition-colors
                                ${data.status == 'active'
                                    ? 'border-green-200 bg-green-50 text-green-600'
                                    : 'border-rose-200 bg-rose-50 text-rose-500'
                                }    
                            `}>
                                {data.status}
                            </span>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button onClick={handleEdit_banner} className="rounded-full border border-border px-4 py-1 text-sm font-semibold text-title transition-colors hover:bg-stone-50">
                                    Edit
                                </button>

                                <button onClick={() => handleDelete_banner(data.id)} className="rounded-full border border-border px-4 py-1 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-50">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </Grid>
            
            {/* Create */}
            <Form title={crud=='create'? 'Add Banner':'Edit Banner'} isOpen={form_banner} onClose={() => setForm_banner(false)} width="max-w-lg"
                
                footer={
                    <>
                        <Button
                            label="Cancel"
                            className="w-24"
                            onClick={() => setForm_banner(false)}
                            disabled={isLoading}
                        />

                        {crud == 'create' ? (
                            <Button
                                label="Save"
                                className="w-24"
                                onClick={handleCreate_banner}
                                disabled={isLoading}
                            />
                        ) : (

                            <Button
                                label="Update"
                                className="w-24"
                                onClick={handleCreate_banner}
                                disabled={isLoading}
                            />
                        )}

                    </>
                }
            >
                <div className="space-y-4">
                
                    {/* 1) Poster */}
                    <Grid className="md:grid-cols-2">
                        <div className="col-span-2">
                            <Field
                                label="Poster"
                                placeholder="Set a poster"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];

                                    if (file) {
                                        setBanner({
                                            ...banner,
                                            poster: file,
                                        });

                                        setPosterPreview_banner(URL.createObjectURL(file));
                                    }
                                }}
                            />

                            {posterPreview_banner && (
                                <div className="mt-3">
                                    <img
                                        src={posterPreview_banner}
                                        alt="Poster preview"
                                        className="w-48 h-48 object-cover rounded-lg border"
                                    />
                                </div>
                            )}
                        </div>
                    </Grid>

                    <Grid className="md:grid-cols-2">
                        {/* 2) Title */}
                        <Field
                            label="Title"
                            placeholder="Enter a title"
                            value={banner.title}                            
                            onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                        />
                        {/* 4) Date */}
                        <Field
                            label="Date expired"
                            placeholder="Enter a title"
                            value={banner.date_expired}
                            onChange={(e) => setBanner({ ...banner, date_expired: e.target.value })}
                            type="date"
                        />
                    </Grid>

                    <Grid className="md:grid-cols-1">
                        {/* 5) Description */}
                        <Field
                            label="Description"
                            placeholder="Enter a description"
                            value={banner.description}
                            onChange={(e) => setBanner({ ...banner, description: e.target.value })}
                            type="textarea"
                        />
                    </Grid>
                </div>
            </Form>
        </>
    )
}

export default Banners;