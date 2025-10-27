"use client"
// import Dropdown from '@/components/Dropdown'
import Input from '@/components/Inputs/Input'
import React, { useState } from 'react'
import Image from 'next/image'
// import CheckBox from '@/components/Inputs/CheckBox'
import Title from '@/components/Title'
import informationIcon from '@/assets/information.svg'
import { MainTable } from '@/components/Table'
import plusIcon from '@/assets/blue-plus.svg'
import Model from '@/components/Model'
import TrashBinIcon from '@/assets/reactIcon/TrashBin'
import TagInput from '@/components/Inputs/TagInput'

type Props = {
    collectorDetails: CollectorDetails,
    error?: { field: string, msg: string } | null,
    onChange: {
        collectorDetails: (collectorDetails: CollectorDetails) => void,
    },
    onSave: () => void
}

const CollectorForm = ({ collectorDetails, error, onChange, onSave = () => { } }: Props) => {
    const [showQualificationPopup, setShowQualificationPopup] = useState<{ index: number } | null>(null);

    return (
        <div className='bg-white mt-4 p-8 px-10'>
            <div className='text-xl flex gap-3 items-center font-bold pb-6'>
                Collector Form
                <Title title={<p className='text-nowrap font-medium'>Fill in the details for the collector</p>}>
                    <Image src={informationIcon} alt="" width={20} height={20} />
                </Title>
            </div>
            <div className='pb-4 font-semibold'>Collector Information</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 pb-5 gap-4 text-sm'>
                <Input label='Name *' name='name' placeholder='Enter name' value={collectorDetails.name} onChange={(val) => onChange.collectorDetails({ ...collectorDetails, name: val })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'name' ? error.msg : ""} />
                <Input label='Email *' name='email' placeholder='Enter email' value={collectorDetails.email} onChange={(val) => onChange.collectorDetails({ ...collectorDetails, email: val })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'email' ? error.msg : ""} />
                <Input label='Password *' name='password' placeholder='Enter password' value={collectorDetails.password} onChange={(val) => onChange.collectorDetails({ ...collectorDetails, password: val })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'password' ? error.msg : ""} />
                <Input label='Phone' name='phone' placeholder='Enter phone number' value={collectorDetails.phone || ''} onChange={(val) => onChange.collectorDetails({ ...collectorDetails, phone: val })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'phone' ? error.msg : ""} />
                <Input label='Adhaar' name='adhaar' placeholder='Enter adhaar number' value={collectorDetails.adhaar || ''} onChange={(val) => onChange.collectorDetails({ ...collectorDetails, adhaar: val })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'adhaar' ? error.msg : ""} />
                <Input label='Experience' name='experience' type='number' placeholder='Enter experience in years' value={collectorDetails.experience?.toString() || ''} onChange={(val) => onChange.collectorDetails({ ...collectorDetails, experience: parseInt(val || '0') })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'experience' ? error.msg : ""} />
            </div>
            <div className='pb-4 flex flex-col gap-1 justify-between'>
                <div className='font-medium text-sm'>Reachable Areas</div>
                <TagInput className='w-full' values={collectorDetails.reachableAreas} onChange={vals => onChange.collectorDetails({ ...collectorDetails, reachableAreas: vals })} />
            </div>
            <div className='pb-4 flex justify-between font-semibold pt-5 border-t-2 border-gray-300/50'>
                Qualification
                <div
                    className='ms-auto flex gap-2 font-semibold text-sm text-blue-500 border-2 border-blue-500 px-4 py-2 rounded cursor-pointer'
                    onClick={() => setShowQualificationPopup({ index: collectorDetails.qualification?.length || 0 })}>
                    <div>New Entry</div>
                    <Image src={plusIcon} alt='' width={20} height={20} />
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <div className='border-2 border-gray-300/50 border-t-0 rounded'>
                    <MainTable<Qualification>
                        config={[
                            { heading: 'Degree', selector: 'degree' },
                            { heading: 'College', selector: 'college' },
                            { heading: 'Year', selector: 'year' },
                            {
                                heading: 'Actions',
                                component: ({ index }) => (
                                    <div className='flex items-center gap-1'>
                                        <button className='text-blue-500' onClick={() => {
                                            setShowQualificationPopup({ index });
                                        }}>
                                            Edit
                                        </button>|
                                        <button onClick={() => {
                                            const newQualifications = [...(collectorDetails.qualification || [])];
                                            newQualifications.splice(index, 1);
                                            onChange.collectorDetails({ ...collectorDetails, qualification: newQualifications });
                                        }}>
                                            <TrashBinIcon />
                                        </button>
                                    </div>
                                )
                            }
                        ]}
                        data={collectorDetails?.qualification || []}
                        className='rounded text-sm border-0' />
                </div>
                {
                    showQualificationPopup && <QualificationPopup
                        qualification={collectorDetails.qualification?.[showQualificationPopup.index]}
                        onClose={() => setShowQualificationPopup(null)}
                        onSave={(qualification) => {
                            const newQualifications = [...(collectorDetails.qualification || [])];
                            newQualifications[showQualificationPopup.index] = qualification;
                            onChange.collectorDetails({ ...collectorDetails, qualification: newQualifications });
                            setShowQualificationPopup(null);
                        }} />
                }
            </div>
            <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={() => { }}>Cancel</div>
                <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => { await onSave(); }}>Save</div>
            </div>
        </div>
    )
}

export default CollectorForm;

export type CollectorDetails = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    reachableAreas?: string[];
    adhaar?: string;
    experience?: number;
    qualification?: Qualification[];
}

export type Qualification = {
    degree?: string;
    college?: string;
    year?: number;
}


const QualificationPopup = ({ qualification, onClose = () => { }, onSave = () => { } }: { qualification?: Qualification, onClose?: () => void, onSave?: (qualification: Qualification) => void }) => {
    const [qualificationData, setQualificationData] = useState<Qualification>(qualification || {
        degree: '',
        college: '',
        year: 0
    })

    return (
        <Model heading='Add Qualification' onClose={onClose}>
            <div className='bg-white p-6 pb-3 px-8'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                    <Input label='Degree *' name='degree' placeholder='Enter degree' value={qualificationData?.degree || ''} onChange={(val) => setQualificationData(prevVal => ({ ...prevVal, degree: val }))} labelClass='font-medium' containerClass='flex-1' />
                    <Input label='College *' name='college' placeholder='Enter college' value={qualificationData?.college || ''} onChange={(val) => setQualificationData(prevVal => ({ ...prevVal, college: val }))} labelClass='font-medium' containerClass='flex-1' />
                    <Input label='Year *' name='year' type='number' placeholder='Enter year' value={qualificationData?.year?.toString() || ''} onChange={(val) => setQualificationData(prevVal => ({ ...prevVal, year: parseInt(val) }))} labelClass='font-medium' containerClass='flex-1' />
                </div>
                <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                    <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={onClose}>Cancel</div>
                    <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                        await onSave(qualificationData);
                    }}>Save</div>
                </div>
            </div>
        </Model>
    )
}