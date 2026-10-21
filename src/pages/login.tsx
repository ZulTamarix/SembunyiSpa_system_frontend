import { useState } from "react";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import api from "../api/axios";
import axios from "axios";

export default function LoginPage() {

    // #region 1) --> useState
        const [isLoading, setIsLoading] = useState(false);

        // fieldname
        const [user, setUser] = useState ({
            email:'',
            password:''
        })

    //#endregion


    // #region 2) --> method

        const handleSubmit = async (e:any) => {
            e.preventDefault();
    
            setIsLoading(true);

            try {
                const response = await api.post(`/login`, {
                    email: user.email,
                    password: user.password,
                    switch: 'admin'
                });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                window.location.href = '/dashboard';
            }
            catch(error) {
                console.error('Error:', error); // use only to remove warning on vscode
                
                // display error
                if (axios.isAxiosError(error)) 
                    alert('❌ ' + error.response?.data?.message);
            }
            finally {
                setIsLoading(false)
            }
        };
    //#endregion


    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-title">Sign in</h1>
                    {/* <p className="mt-1 text-sm text-slate-500">Enter your email and password to continue.</p> */}
                </div>

                <form onSubmit={handleSubmit} className="mt-3 space-y-4" noValidate>

                    <Field
                        label="Email"
                        placeholder="Enter email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                    <Field
                        label="Password"
                        placeholder="Enter password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        type="password"
                    />

                    <div className="mt-5">
                        <Button disabled={isLoading} label="Sign in"></Button>
                    </div>
                </form>
            </div>
        </main>
    );
}