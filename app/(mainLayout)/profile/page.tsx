'use client'
import Input from '@/components/Inputs/Input'
import React, { useEffect, useState } from 'react'
import PatientDetailsPopup from '../../components/popups/PatientDetailsPopup'
import fetcher from '@/lib/fetcher'
import Image from 'next/image'
import userIcon from '@/assets/user.png';
import { toast } from 'react-toastify'
import AddressDetailsPopup from '@/app/components/popups/AddressDetailsPopup'

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
    const [showPatientPopup, setShowPatientPopup] = useState<{ patientIndex: number } | null>(null);
    const [showAddressPopup, setShowAddressPopup] = useState<{ addressIndex: number } | null>(null);

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
        <div className='flex-1 dark:bg-[#0A192F]'>
            <div className='h-40 bg-primary bg-opacity-15'>
                <div className='w-32 h-32 flex justify-center items-center top-full translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[rgb(23,42,70)] rounded-full relative'>
                    <Image src={userIcon} alt="profile picture" width={118} height={118} className='w-[118px] h-[118px] p-2 border-4 border-primary shadow-lg shadow-[rgba(57,134,186,0.2)] rounded-full bg-white dark:bg-[#172A46]' />
                </div>
            </div>
            <section className='p-20 pb-2 px-10 md:px-20'>
                <div className='font-semibold text-lg'>Account Details</div>
                <div className='mt-2 grid gap-6 grid-cols-1 md:grid-cols-2'>
                    <Input label='Name' value={user.name} onChange={(val) => { setUser({ ...user, name: val }); setIsDirty(true) }} />
                    <Input label='Email / Phone' value={user.email} onChange={(val) => { setUser({ ...user, email: val }); setIsDirty(true) }} />
                    {/* <Input label='Password' value={user.password} onChange={(val) => { setUser({ ...user, password: val }); setIsDirty(true) }} /> */}
                    <Input label='Alternate Email / Phone' value={user.phone || ''} onChange={(val) => { setUser({ ...user, phone: val }); setIsDirty(true) }} />
                </div>
            </section>
            <section className='px-10 md:px-20 pt-2'>
                <div className='font-semibold text-lg'>Patient Details</div>
                <div className='flex gap-2 mt-2 text-sm text-white'>
                    {user?.patientDetails?.map((patientDetail, i) => (
                        <div
                            key={i}
                            className='bg-primary bg-opacity-75 px-4 py-2 rounded-full cursor-pointer'
                            onClick={() =>
                                setShowPatientPopup({ patientIndex: i })}>
                            {patientDetail.name}
                        </div>
                    ))}
                    <div
                        className='bg-primary bg-opacity-75 px-4 py-2 rounded-full cursor-pointer'
                        onClick={() =>
                            setShowPatientPopup({ patientIndex: user.patientDetails?.length || 0 })}>
                        Add +
                    </div>
                </div>
            </section>
            <section className='px-10 md:px-20 pt-2 mt-2'>
                <div className='font-semibold text-lg'>Address Details</div>
                <div className='flex gap-2 mt-2 text-sm text-white'>
                    {user?.address?.map((address, i) => (
                        <div
                            key={i}
                            className='bg-primary bg-opacity-75 px-4 py-2 rounded-full cursor-pointer'
                            onClick={() =>
                                setShowAddressPopup({ addressIndex: i })}>
                            {address.pin}
                        </div>
                    ))}
                    <div
                        className='bg-primary bg-opacity-75 px-4 py-2 rounded-full cursor-pointer'
                        onClick={() =>
                            setShowAddressPopup({ addressIndex: user.address?.length || 0 })}>
                        Add +
                    </div>
                </div>
            </section>
            {isDirty && <div className='px-10 md:px-20 pt-8 pb-10 flex'>
                <button className='bg-primary text-white py-2 px-4 rounded ms-auto' onClick={async () => await updateUser()}>Save</button>
            </div>}
            <div className='px-10 md:px-20 pt-8 pb-10 flex'>
                <button className='bg-primary text-white py-2 px-4 rounded-md'>Delete Your Account</button>
            </div>
            {showPatientPopup?.patientIndex != null &&
                <PatientDetailsPopup
                    patientDetails={user.patientDetails?.[showPatientPopup.patientIndex]}
                    onClose={() => setShowPatientPopup(null)}
                    onSave={async values => {
                        const updatedPatientDetails = [...(user.patientDetails || [])];
                        updatedPatientDetails[showPatientPopup.patientIndex] = values;
                        // console.log(updatedPatientDetails)
                        setUser({ ...user, patientDetails: updatedPatientDetails });
                        setIsDirty(true);
                        // await updateUser();
                        setShowPatientPopup(null);
                    }}
                    onRemove={() => {
                        const updatedPatientDetails = [...(user.patientDetails || [])];
                        updatedPatientDetails.splice(showPatientPopup.patientIndex, 1);
                        setUser({ ...user, patientDetails: updatedPatientDetails });
                        setIsDirty(true);
                        // await updateUser();
                        setShowPatientPopup(null);
                    }} />}
            {
                showAddressPopup?.addressIndex != null &&
                <AddressDetailsPopup
                    addressDetails={user.address?.[showAddressPopup.addressIndex]}
                    onClose={() => setShowAddressPopup(null)}
                    onRemove={() => {
                        const updatedAddressDetails = [...(user.address || [])];
                        updatedAddressDetails.splice(showAddressPopup.addressIndex, 1);
                        setUser({ ...user, address: updatedAddressDetails });
                        setIsDirty(true);
                        // await updateUser();
                        setShowAddressPopup(null);
                    }}
                    onSave={async values => {
                        const updatedAddressDetails = [...(user.address || [])];
                        updatedAddressDetails[showAddressPopup.addressIndex] = values;
                        // console.log(updatedPatientDetails)
                        setUser({ ...user, address: updatedAddressDetails });
                        setIsDirty(true);
                        // await updateUser();
                        setShowAddressPopup(null);
                    }} />
            }
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