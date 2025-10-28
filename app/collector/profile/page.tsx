'use client'
import Input from '@/components/Inputs/Input'
import React, { useEffect, useState } from 'react'
import fetcher from '@/lib/fetcher'
import { toast } from 'react-toastify'
import TagInput from '@/components/Inputs/TagInput'
import UserIcon from '@/assets/reactIcon/User'

const ProfilePage = () => {
    const [user, setUser] = useState<User>({
        name: '',
        email: '',
        password: '',
        verified: false,
        reachableAreas: [],
        chatId: ''
    })
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        fetchUser();
    }, [])

    async function fetchUser() {
        const res = await fetcher.get<User>('/collector/user');
        if (res.status === 200 && res.body)
            setUser(res.body)
    }

    async function updateUser() {
        const res = await fetcher.post<User, User>('/collector/user', user);
        if (res.status === 200 && res.body) {
            setUser(res.body)
            setIsDirty(false)
            toast.success('User updated successfully')
        }
    }

    return (
        <div className='flex-1'>
            <div className='h-40 bg-primary/10 dark:bg-white/10'>
                <div className='w-32 h-32 flex justify-center items-center top-full translate-x-1/2 -translate-y-1/2 bg-white dark:bg-black rounded-full relative'>
                    <UserIcon size={118} className='w-[118px] h-[118px] p-2 border-4 border-white/20 shadow-lg shadow-[rgba(57,134,186,0.2)] rounded-full bg-white dark:bg-white/15' />
                </div>
            </div>
            <section className='p-20 pb-2 px-10 md:px-12'>
                <div className='font-semibold text-lg'>Account Details</div>
                <div className='mt-2 mb-6 grid gap-6 grid-cols-1 md:grid-cols-2'>
                    <Input label='Name' value={user.name} onChange={(val) => { setUser({ ...user, name: val }); setIsDirty(true) }} labelClass='font-medium' />
                    <Input label='Email / Phone' value={user.email} onChange={(val) => { setUser({ ...user, email: val }); setIsDirty(true) }} labelClass='font-medium' />
                    {/* <Input label='Password' value={user.password} onChange={(val) => { setUser({ ...user, password: val }); setIsDirty(true) }} /> */}
                    <Input label='Alternate Email / Phone' value={user.phone || ''} onChange={(val) => { setUser({ ...user, phone: val }); setIsDirty(true) }} labelClass='font-medium' />
                    <Input label='Chat ID' value={user.chatId} onChange={(val) => { setUser({ ...user, chatId: val }); setIsDirty(true) }} labelClass='font-medium' />
                </div>
                <TagInput label='Reachable Areas' values={user.reachableAreas} onChange={(tags) => { setUser({ ...user, reachableAreas: tags }); setIsDirty(true) }} />
            </section>
            {isDirty && <div className='px-10 md:px-12 pt-8 pb-10 flex'>
                <button className='bg-primary dark:bg-white/20 text-white py-2 px-4 rounded ms-auto' onClick={async () => await updateUser()}>Save</button>
            </div>}
            <div className='px-10 md:px-12 pt-8 pb-10 flex'>
                <button className='bg-red-600 text-white py-2 px-4 rounded-xs'>Delete Your Account / Resign</button>
            </div>
        </div>
    )
}

export default ProfilePage

export type User = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    verified: boolean;
    otp?: string;
    otpExpiry?: Date;
    reachableAreas: string[],
    chatId: string
}