'use client'
import React, { useEffect, useState } from 'react'
import { User } from '../page';
import fetcher from '@/lib/fetcher';
import { toast } from 'react-toastify';
import PatientDetailsPopup from '@/app/components/popups/PatientDetailsPopup';

const PatientsPage = () => {
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
                <div className='font-semibold text-lg mb-2'>Patient Details</div>
                <div
                    className='border-2 border-primary text-primary font-semibold w-fit bg-opacity-75 px-3.5 py-1.5 rounded-lg cursor-pointer'
                    onClick={() =>
                        setShowPatientPopup({ patientIndex: user.patientDetails?.length || 0 })}>
                    Add +
                </div>
                <div className='flex flex-wrap gap-2 mt-2 text-sm text-white'>
                    {user?.patientDetails?.map((patientDetail, i) => (
                        <div
                            key={i}
                            className='border-2 dark:border-gray-500 dark:bg-[#172A46] text-black px-4 py-3.5 rounded-md cursor-pointer'
                            onClick={() =>
                                setShowPatientPopup({ patientIndex: i })}>
                            <div className='font-semibold mb-1 text-black dark:text-white'>{patientDetail.name}</div>
                            <div className='text-gray-800 dark:text-gray-400'>{patientDetail.age} - {patientDetail.gender}</div>
                        </div>
                    ))}
                </div>
                {isDirty && <div className='pt-8 pb-10 flex'>
                    <button className='bg-primary text-white py-2 px-4 rounded ms-auto' onClick={async () => await updateUser()}>Save</button>
                </div>}
            </section>

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
        </>
    )
}

export default PatientsPage