'use client'
import Input from '@/components/Inputs/Input'
import React, { useEffect, useState } from 'react'
import fetcher from '@/lib/fetcher'
import { toast } from 'react-toastify'
import UserIcon from '@/assets/reactIcon/User'

const ProfilePage = () => {
    const [user, setUser] = useState<User>({
        name: '',
        email: '',
        password: '',
        verified: false,
        patientDetails: [],
        address: [],
        createdAt: new Date(),
        updatedAt: new Date()
    })
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        fetchUser();
    }, [])

    async function fetchUser() {
        const res = await fetcher.get<User>('/user');
        if (res.status === 200 && res.body)
            setUser(res.body)
    }

    async function updateUser() {
        const res = await fetcher.post<User, User>('/user', user);
        if (res.status === 200 && res.body) {
            setUser(res.body)
            setIsDirty(false)
            toast.success('User updated successfully')
        }
    }

    return (
        <div className='flex-1 text-sm sm:text-base'>
            {/* <div className='h-40 bg-primary bg-opacity-15'>
                <div className='w-32 h-32 flex justify-center items-center top-full translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[rgb(23,42,70)] rounded-full relative'>
                </div>
            </div> */}
            <section className='pt-0 pb-2 sm:pb-4'>
                <div className='border-2 border-gray-300/50 bg-white dark:bg-[#172A46] dark:border-gray-500 relative flex flex-col sm:flex-row gap-4 items-center rounded-lg px-3 sm:px-5 py-3 sm:py-5 text-primary'>
                    <UserIcon size={120} className='w-16 h-16 md:w-20 md:h-20 p-4 bg-primary/20 dark:bg-primary/30 rounded-full' />
                    <div className='text-center sm:text-left'>
                        <div className='text-base sm:text-lg md:text-xl font-bold'>{user.name}</div>
                        <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>{user.email}</div>
                    </div>
                </div>
            </section>
            <section className='pt-5 pb-2'>
                <div className='font-semibold text-base sm:text-lg'>Account Details</div>
                <div className='mt-2 grid gap-6 grid-cols-1 md:grid-cols-2'>
                    <Input label='Name' labelClass='text-sm sm:text-base' value={user.name} onChange={(val) => { setUser({ ...user, name: val }); setIsDirty(true) }} />
                    <Input label='Phone' labelClass='text-sm sm:text-base' value={user.email} onChange={(val) => { setUser({ ...user, email: val }); setIsDirty(true) }} />
                    {/* <Input label='Password' value={user.password} onChange={(val) => { setUser({ ...user, password: val }); setIsDirty(true) }} /> */}
                    <Input label='Email / Alternate Phone' labelClass='text-sm sm:text-base' value={user.phone || ''} onChange={(val) => { setUser({ ...user, phone: val }); setIsDirty(true) }} />
                </div>
            </section>
            {isDirty && <div className='pt-8 pb-10 flex'>
                <button className='bg-primary text-white py-2 px-4 rounded ms-auto' onClick={async () => await updateUser()}>Save</button>
            </div>}
            {/* <div className='pt-8 pb-10 flex'>
                <button className='bg-primary text-white py-2 px-4 rounded-md'>Delete Your Account</button>
            </div> */}
        </div>
    )
}

export default ProfilePage

export type User = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    patientDetails: {
        name: string;
        gender: 'Male' | 'Female' | 'Other';
        // phone: string;
        age: number;
        other?: string;
    }[];
    address: {
        pin: string;
        city: string;
        district: string;
        other?: string;
        phone: string;
    }[];
    verified: boolean;
    otp?: string;
    otpExpiry?: Date;

    createdAt: Date;
    updatedAt: Date;
}