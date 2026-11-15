import { useState } from "react";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import api from "../api/axios";
import logo from '../assets/logo_rectangle.png'; 
import axios from "axios";

export default function DeleteUserPage() {


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
                const response = await api.post(`/mobile/customer/delete`, {
                    email: user.email,
                    password: user.password,
                });

                alert('✅ ' + response?.data?.message);
                setUser({
                    email: '',
                    password: ''
                })

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    alert('❌ ' + (error.response?.data?.message || 'Something went wrong.'));
                } else {
                    alert('❌ Unexpected error occurred.');
                }
            } finally {
                setIsLoading(false);
            }
        };
    //#endregion
    
    
    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <img src={logo} alt="MyApp Logo" className="w-64 h-auto mx-auto border-2 border-border rounded-2xl mb-3" />

                    <h1 className="text-2xl font-bold text-title">Delete Account</h1>
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
                        <Button disabled={isLoading || (user.email=='' || user.password=='')} label="Delete My Account"></Button>
                    </div>
                    <span className="block w-full text-center text-sm text-title">
                        Powered by Exibyte
                    </span>

                </form>
            </div>
        </main>
    );
}