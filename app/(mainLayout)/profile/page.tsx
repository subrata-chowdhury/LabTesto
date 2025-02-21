'use client'
import Input from '@/components/Inputs/Input'
import React, { useEffect, useState } from 'react'
import PatientDetailsPopup from '../../components/popups/PatientDetailsPopup'
import fetcher from '@/lib/fetcher'
import Image from 'next/image'
import { toast } from 'react-toastify'
import Model from '@/components/Model'

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
        <div className='flex-1'>
            <div className='h-40 bg-orange-100'>
                <div className='w-32 h-32 flex justify-center items-center top-full translate-x-1/2 -translate-y-1/2 bg-white rounded-full relative'>
                    <Image src={'/user.png'} alt="profile picture" width={118} height={118} className='w-[118px] h-[118px] p-2 border-4 border-orange-600 shadow-lg shadow-orange-200 rounded-full bg-white' />
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
            <div className='px-20 pt-2 mt-2'>
                <div className='font-semibold text-lg'>Address Details</div>
                <div className='flex gap-2 mt-2 text-sm text-white'>
                    {user?.address?.map((address, i) => (
                        <div
                            key={i}
                            className='bg-orange-400 px-4 py-2 rounded-full cursor-pointer'
                            onClick={() =>
                                setShowAddressPopup({ addressIndex: i })}>
                            {address.pin}
                        </div>
                    ))}
                    <div
                        className='bg-orange-400 px-4 py-2 rounded-full cursor-pointer'
                        onClick={() =>
                            setShowAddressPopup({ addressIndex: user.address?.length || 0 })}>
                        Add +
                    </div>
                </div>
            </div>
            {isDirty && <div className='px-20 pt-8 pb-10 flex'>
                <button className='bg-orange-500 text-white py-2 px-4 rounded ms-auto' onClick={async () => await updateUser()}>Save</button>
            </div>}
            <div className='px-20 pt-8 pb-10 flex'>
                <button className='bg-orange-500 text-white py-2 px-4 rounded-md'>Delete Your Account</button>
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
        pin: number;
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

function AddressDetailsPopup({ addressDetails, onSave, onClose }: { addressDetails?: AddressDetails, onSave: (patientDetails: AddressDetails) => void, onClose: () => void }) {
    const [values, setValues] = useState<AddressDetails>(addressDetails || {
        pin: 0,
        city: '',
        district: '',
        other: '',
        phone: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    return (
        <Model heading='Address Details' onClose={onClose}>
            <div className='px-7 py-4 min-w-80'>
                <div className='pb-2 font-semibold'>Basic Information</div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm pb-4'>
                    <Input label='City *' value={values.city} error={errors.city} onChange={val => setValues({ ...values, city: val })} />
                    {/* <div className='text-sm flex flex-col gap-1'>
                        <label className='font-medium'>Gender *</label>
                        <Dropdown options={['Male', 'Female', 'Other']} width={'100%'} value={'Male'} onChange={({ value }) => setValues({ ...values, gender: value as 'Male' | 'Female' | 'Other' })} />
                    </div> */}
                    <Input label='District *' value={values.district} error={errors.district} onChange={val => setValues({ ...values, district: val })} />
                    <Input label='Pin *' value={values.pin?.toString()} type="number" error={errors.pin} onChange={val => setValues({ ...values, pin: Number(val) })} />
                    <Input label='Phone *' value={values.phone} error={errors.phone} onChange={val => setValues({ ...values, phone: val })} />
                </div>
                <div className='text-sm flex flex-col gap-1 pt-2'>
                    <label className='font-medium'>Landmark / Any Other details</label>
                    <textarea className='border-2 rounded w-full h-20 p-2 outline-none' rows={5} placeholder='Enter Other Details' value={values.other} onChange={(e) => setValues({ ...values, other: e.target.value })}></textarea>
                </div>
                <div className='p-5 pb-2 px-0 ms-auto justify-end items-end flex gap-4'>
                    <div className='font-medium text-orange-500 h-10 flex justify-center items-center px-4 border-2 border-orange-500 rounded cursor-pointer' onClick={onClose}>Cancel</div>
                    <div className='bg-orange-500 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                        // validate
                        const errors: { [key: string]: string } = {};
                        if (!values.city) errors.city = 'City is required';
                        if (!values.district) errors.district = 'District is required';
                        if (!values.phone) errors.phone = 'Phone is required';
                        if (!values.pin) errors.pin = 'Pin is required';
                        if (Object.keys(errors).length) return setErrors(errors);

                        await onSave(values);
                    }}>Save</div>
                </div>
            </div>
        </Model>
    )
}

type AddressDetails = {
    pin: number;
    city: string;
    district: string;
    other?: string;
    phone: string;
}