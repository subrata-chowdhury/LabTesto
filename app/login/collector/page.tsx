'use client'
import React, { useState } from "react";
import fetcher from "@/lib/fetcher";
import Link from "next/link";
import PasswordInput from "@/components/Inputs/PasswordInput";
import Input from "@/components/Inputs/Input";
import { toast } from "react-toastify";

export default function AdminLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        field: '',
        msg: ''
    });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function login(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        // verification logic
        if (!email || email?.length <= 0) {
            setError({ field: 'email', msg: 'Email is required' });
            return;
        }
        if (!password || password?.length <= 0) {
            setError({ field: 'password', msg: 'Password is required' });
            return;
        }
        setLoading(true);
        await fetcher.post<{ email: string, password: string }, { user: { verified: boolean, institution: string, type: string }, token: string }>('/collector/auth/login', { email, password }).then(async (res) => {
            if (res.status !== 200) {
                toast.error(res.error || 'Error signing up');
                return;
            }
            if (res.body) {
                // Store token securely
                document.cookie = `collectorToken=${res.body.token}; path=/; secure; samesite=strict`;
                const urlParams = new URLSearchParams(window.location.search);
                const redirectUrl = urlParams.get('redirect') || '/collector';
                await fetcher.get('/cart/count');
                setTimeout(() => window.location.replace(redirectUrl), 300)
            }
        });
        setLoading(false);
    }

    return (
        <div className="flex flex-col md:flex-row h-screen gap-0">
            <div className="md:w-1/2 flex flex-col gap-4 justify-center items-center bg-gray-200 dark:bg-[#0A192F] w-full h-full">
                <h1 className="text-2xl font-semibold">Welcome Back Collector</h1>
                <div>Your ability which make us reach the sky</div>
            </div>
            <div className="md:w-1/2 md:h-auto flex flex-col justify-center absolute md:relative items-center w-full h-full">
                <h1 className="md:pl-6 ps-0 pb-3 md:pb-0 w-11/12 md:w-9/12 max-w-[450px] text-center md:text-start text-2xl font-semibold">Log In to <span className="text-orange-500">Lab</span><span className="text-blue-600">Testo</span> Admin</h1>
                <form className="flex flex-col gap-4 bg-transparent p-6 rounded-md w-11/12 md:w-9/12 max-w-[450px]">
                    <Input
                        label="Email"
                        value={email}
                        onChange={val => setEmail(val.trim())}
                        error={(error.field == 'email' && error.msg?.length > 0) ? error.msg : ''}
                        name="email"
                        placeholder="eg., example@email.com" />
                    <div className="flex flex-col gap-1">
                        <PasswordInput
                            label="Password"
                            value={password}
                            onChange={val => setPassword(val)}
                            error={(error.field == 'password' && error.msg?.length > 0) ? error.msg : ''}
                            name="password"
                            placeholder="Password" />
                        <div className="font-medium text-[0.9rem] text-blue-600 ms-auto">
                            <Link href="/">Forgot Password</Link>
                        </div>
                    </div>
                    <button className="bg-blue-500 text-white rounded p-2" onClick={login} disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
                </form>
            </div>
        </div>
    )
} 
