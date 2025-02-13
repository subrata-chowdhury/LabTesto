'use client'
import Input from '@/components/Inputs/Input'
import React, { useEffect, useState } from 'react'
import PatientDetailsPopup from '../components/popups/PatientDetailsPopup'
import fetcher from '@/lib/fetcher'

const ProfilePage = () => {
    const [user, setUser] = useState<User>({
        name: '',
        email: '',
        password: '',
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date()
    })
    const [isDirty, setIsDirty] = useState(false);
    const [showPatientPopup, setShowPatientPopup] = useState<{ patientIndex: number } | null>(null);

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
            alert('User updated successfully')
        }
    }

    return (
        <div className='flex-1'>
            <div className='h-40 bg-orange-100'>
                <div className='w-32 h-32 flex justify-center items-center top-full translate-x-1/2 -translate-y-1/2 bg-white rounded-full relative'>
                    <img src={'./user.png'} className='w-[118px] h-[118px] p-2 border-4 border-orange-300 shadow-lg shadow-orange-200 rounded-full bg-white' />
                </div>
            </div>
            <div className='p-20 pb-2 px-10 md:px-20 '>
                <div className='font-semibold text-lg'>Account Details</div>
                <div className='mt-2 grid gap-6 grid-cols-1 md:grid-cols-2'>
                    <Input label='Name' value={user.name} onChange={(val) => { setUser({ ...user, name: val }); setIsDirty(true) }} />
                    <Input label='Email' value={user.email} onChange={(val) => { setUser({ ...user, email: val }); setIsDirty(true) }} />
                    {/* <Input label='Password' value={user.password} onChange={(val) => { setUser({ ...user, password: val }); setIsDirty(true) }} /> */}
                    <Input label='Phone' value={user.phone || ''} onChange={(val) => { setUser({ ...user, phone: val }); setIsDirty(true) }} />
                </div>
            </div>
            <div className='px-20 pt-2'>
                <div className='font-semibold text-lg'>Patient Details</div>
                <div className='flex gap-2 mt-2 text-sm text-white'>
                    {user?.patientDetails?.map((patientDetail, i) => (
                        <div
                            key={i}
                            className='bg-orange-400 px-4 py-2 rounded-full cursor-pointer'
                            onClick={() =>
                                setShowPatientPopup({ patientIndex: i })}>
                            {patientDetail.name}
                        </div>
                    ))}
                    <div
                        className='bg-orange-400 px-4 py-2 rounded-full cursor-pointer'
                        onClick={() =>
                            setShowPatientPopup({ patientIndex: user.patientDetails?.length || 0 })}>
                        Add +
                    </div>
                </div>
            </div>
            {
                isDirty && <div className='px-20 pt-8 pb-10 flex'>
                    <button className='bg-orange-500 text-white py-2 px-4 rounded ms-auto' onClick={async () => await updateUser()}>Save</button>
                </div>
            }
            {showPatientPopup?.patientIndex != null &&
                <PatientDetailsPopup
                    patientDetails={user.patientDetails?.[showPatientPopup.patientIndex]}
                    onClose={() => setShowPatientPopup(null)}
                    onSave={async values => {
                        const updatedPatientDetails = [...(user.patientDetails || [])];
                        updatedPatientDetails[showPatientPopup.patientIndex] = values;
                        await updateUser();
                        setShowPatientPopup(null);
                    }} />}
        </div>
    )
}

export default ProfilePage

type User = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    patientDetails?: {
        name: string;
        phone: string;
        address: {
            pin: number;
            city: string;
            district: string;
            other?: string;
        };
    }[];

    verified: boolean;
    otp?: string;
    otpExpiry?: Date;

    createdAt: Date;
    updatedAt: Date;
}