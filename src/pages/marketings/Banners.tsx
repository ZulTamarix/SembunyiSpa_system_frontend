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

            console.log('data = ',banner)

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
                console.log('data = ',data)

            }
            // DELETE package
            const handleDelete_banner = (id: number) => {
                console.log('id = ',id)

            }
    //#endregion
    // #region 4) --> database

        // c) banner
        const [databaseBanner, setDatabase_banner] = useState<Banner_type[]>([])
        const fetchData_banner = useCallback(() => {
            api.get(`/banner`)
            .then((response) => {
                console.log('data = ',response.data)
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
                    <div className="flex w-full flex-col rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
                        {/* Poster */}
                        <div className="mb-5 h-48 w-full overflow-hidden rounded-2xl">
                            <img
                                src={`http://localhost:8000/${data.poster}`}
                                alt={data.title}
                                className="h-full w-full"
                            />
                        </div>

                        {/* Title */}
                        <div className="mt-3 h-6">
                            <h2 className="text-base font-serif font-bold text-stone-900 uppercase">
                                {data.title}
                            </h2>
                        </div>

                        {/* Description */}
                        <div className="mt-3 flex-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-title font-semibold">
                                    {data.description.length > 150
                                        ? `${data.description.slice(0, 150)}...`
                                        : data.description}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-3 flex gap-3">
                            <button
                                onClick={handleEdit_banner}
                                className="flex-1 rounded-full border border-border py-1 text-sm font-semibold text-title transition-colors hover:bg-stone-50"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() =>handleDelete_banner(data.id)}
                                className="flex-1 rounded-full border border-border py-1 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-50"
                            >
                                Remove
                            </button>
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