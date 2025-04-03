'use client'
import React, { useEffect, useState } from 'react'
import { User } from '../page';
import fetcher from '@/lib/fetcher';
import { toast } from 'react-toastify';
import AddressDetailsPopup from '@/app/components/popups/AddressDetailsPopup';

const AddressesPage = () => {
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
        <>

            <section className='w-full'>
                <div className='font-semibold text-lg mb-2'>Address Details</div>
                <div
                    className='border-2 border-primary text-primary text-sm sm:text-base font-semibold w-fit bg-opacity-75 px-3.5 py-1.5 rounded-lg cursor-pointer'
                    onClick={() =>
                        setShowAddressPopup({ addressIndex: user.address?.length || 0 })}>
                    Add +
                </div>
                <div className='flex flex-wrap gap-2 mt-2 text-sm text-white'>
                    {user?.address?.map((address, i) => (
                        <div
                            key={i}
                            className='border-2 dark:border-gray-500 dark:bg-[#172A46] px-4 py-3.5 rounded-md cursor-pointer'
                            onClick={() =>
                                setShowAddressPopup({ addressIndex: i })}>
                            <div className='font-semibold mb-1 text-black dark:text-white'>{address.phone}</div>
                            <div className='text-gray-800 dark:text-gray-400'>{address.city}, {address.district}{address.other ? `, ${address.other}` : ''} - <span className='font-semibold'>{address.pin}</span></div>
                        </div>
                    ))}
                </div>
                {isDirty && <div className='pt-8 pb-10 flex'>
                    <button className='bg-primary text-white py-2 px-4 rounded ms-auto' onClick={async () => await updateUser()}>Save</button>
                </div>}
            </section>
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
        </>
    )
}

export default AddressesPage