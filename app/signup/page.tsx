'use client'
import { useState } from "react";
import fetcher from "@/lib/fetcher";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/Inputs/PasswordInput";
import Input from "@/components/Inputs/Input";
import { toast } from "react-toastify";
import { encryptData } from "@/lib/encryption";

export default function Signup() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        field: '',
        msg: ''
    });
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useRouter();

    async function signup(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // verification logic
        if (!name || name?.length <= 0) {
            setError({ field: 'name', msg: 'Name is required' });
            return
        }
        if (!email || email?.length <= 0) {
            setError({ field: 'email', msg: 'Phone number is required' });
            return;
        }
        if (email.length !== 10) {
            setError({ field: 'email', msg: 'Invalid Phone number' });
            return;
        }
        if (!password || password?.length <= 0) {
            setError({ field: 'password', msg: 'Password is required' });
            return;
        }
        if (password.length < 8) {
            setError({ field: 'password', msg: 'Password must be at least 8 characters' });
            return;
        }
        // if (!confirmPassword || confirmPassword?.length <= 0) {
        //     setError({ field: 'confirmpassword', msg: 'Confirm Password is required' });
        //     return;
        // }
        // if (password !== confirmPassword) {
        //     setError({ field: 'confirmpassword', msg: 'Passwords do not match' });
        //     return;
        // }

        // submit logic
        setLoading(true);
        await fetcher.post<{ name: string, email: string, password: string }, { user: { verified: boolean, name: string, email: string }, token: string }>('/auth/signup', { name: name, email: email, password: await encryptData(password) }).then((res) => {
            if (res.status !== 200) {
                toast.error(res.error || 'Error signing up');
                return
            }
            if (res.body) {
                document.cookie = `token=${res.body.token}; path=/; secure; samesite=strict`;
                const urlParams = new URLSearchParams(window.location.search);
                const redirectUrl = urlParams.get('redirect') || '/';
                localStorage.setItem('isLoggedIn', JSON.stringify(true));
                localStorage.setItem('userName', res.body.user.name);
                localStorage.setItem('userEmail', res.body.user.email);
                setTimeout(() => navigate.replace(redirectUrl), 300);
            }
        });
        setLoading(false);
    }

    return (
        <div className="flex flex-col md:flex-row h-screen gap-0">
            <div className="md:w-1/2 hidden md:flex flex-col gap-4 justify-center items-center bg-gray-200 dark:bg-[#0A192F] w-full h-full">
                <h1 className="text-2xl font-semibold">Welcome to <span className="text-orange-500">Lab</span><span className="text-blue-600">Testo</span></h1>
                <div>Your wellness which makes us Happy</div>
            </div>
            <div className="md:w-1/2 md:h-auto flex flex-col justify-center absolute md:relative items-center w-full h-full">
                <h1 className="md:pl-6 ps-0 pb-3 md:pb-0 w-11/12 md:w-9/12 max-w-[450px] text-center md:text-start text-2xl font-semibold">Sign Up to <span className="text-orange-500">Lab</span><span className="text-blue-600">Testo</span></h1>
                <form className="flex flex-col gap-4 bg-transparent p-6 rounded-md w-11/12 md:w-9/12 max-w-[450px]" onSubmit={signup}>
                    <Input
                        label="Full Name"
                        value={name}
                        onChange={val => setName(val)}
                        error={(error.field == 'name' && error.msg?.length > 0) ? error.msg : ''}
                        name="name"
                        placeholder="Enter Your Full Name" />
                    <Input
                        label="Phone No."
                        value={email}
                        onChange={val => setEmail(val.trim())}
                        error={(error.field == 'email' && error.msg?.length > 0) ? error.msg : ''}
                        name="phone"
                        placeholder="Enter You Phone Number" />
                    <div className="flex flex-col gap-1">
                        <PasswordInput
                            label="Password"
                            value={password}
                            onChange={val => setPassword(val)}
                            error={(error.field == 'password' && error.msg?.length > 0) ? error.msg : ''}
                            name="password"
                            placeholder="Password" />
                    </div>
                    {/* <div className="flex flex-col gap-1">
                        <PasswordInput
                            label="Confirm Password"
                            value={confirmPassword}
                            onChange={val => setConfirmPassword(val)}
                            error={(error.field == 'confirmpassword' && error.msg?.length > 0) ? error.msg : ''}
                            name="confirmpassword"
                            placeholder="Confirm Password" />
                    </div> */}
                    <button type="submit" className="bg-primary text-white rounded p-2" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
                    <div className="flex flex-col">
                        <div className="text-[0.9rem] text-center text-slate-500 dark:text-gray-400">Already have an account?</div>
                        <Link href="/login" className="bg-gray-300 text-center text-slate-700 rounded p-2 border-2 border-gray-300">Log In</Link>
                    </div>
                </form>
            </div>
        </div>
    )
} 
