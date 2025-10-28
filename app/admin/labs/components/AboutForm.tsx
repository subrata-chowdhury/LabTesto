import Input from '@/components/Inputs/Input'
import { MainTable } from '@/components/Table'
import React, { useState } from 'react'
import Image from 'next/image'
import Model from '@/components/Model'
import plusIcon from '@/assets/blue-plus.svg'
import RichTextEditor from '@/app/components/RichTextEditor'
import UploadToCloudinary from '@/app/components/ImageInput'
import TrashBinIcon from '@/assets/reactIcon/TrashBin'

type Props = {
    labDetails: LabAboutDetails,
    loading?: boolean,
    onChange: (labDetails: LabAboutDetails) => void,
    onSave: () => void
}

const AboutForm = ({ labDetails, loading, onChange = () => { }, onSave = async () => { } }: Props) => {
    const [certificationIndex, setCetificationIndex] = useState<{ index: number } | null>(null)

    return (
        <div className='bg-white dark:bg-black mt-4 p-8 px-10'>
            <div className='text-xl flex gap-3 items-center font-bold pb-6'>
                About Lab Form
                {/* <Title title={<p className='text-nowrap font-medium'>To autofill by labs themselves, <br /> enable checkbox at below of this form</p>}>
                    <Image src={informationIcon} alt="" width={20} height={20} />
                </Title> */}
            </div>
            <div className='pb-4 font-semibold'>Lab Information</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                <Input label='Name *' name='name' placeholder='Enter name' value={labDetails.name} onChange={(val) => onChange({ ...labDetails, name: val })} labelClass='font-medium' containerClass='flex-1' />
                <div className={"flex flex-col gap-1 "}>
                    <div>Image</div>
                    <UploadToCloudinary imgUrl={labDetails.image} apiPath='/api/admin/labs/upload' onUpload={url => onChange({ ...labDetails, image: url })} />
                </div>
            </div>
            <div className='pb-4 font-semibold mt-6 pt-5 border-t-2 border-gray-300/50'>Address Information</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm pb-4'>
                <Input label='City *' value={labDetails.location.address.city} onChange={val => onChange({ ...labDetails, location: { location: labDetails.location.location, address: { ...labDetails.location.address, city: val } } })} labelClass='font-medium' />
                {/* <div className='text-sm flex flex-col gap-1'>
                        <label className='font-medium'>Gender *</label>
                        <Dropdown options={['Male', 'Female', 'Other']} width={'100%'} value={'Male'} onChange={({ value }) => setValues({ ...values, gender: value as 'Male' | 'Female' | 'Other' })} />
                    </div> */}
                <Input label='District *' value={labDetails.location.address.district} onChange={val => onChange({ ...labDetails, location: { location: labDetails.location.location, address: { ...labDetails.location.address, district: val } } })} labelClass='font-medium' />
                <Input label='Pin *' value={labDetails.location.address.pin?.toString()} onChange={val => onChange({ ...labDetails, location: { location: labDetails.location.location, address: { ...labDetails.location.address, pin: val } } })} labelClass='font-medium' />
                <Input label='Other' value={labDetails.location.address.other} onChange={val => onChange({ ...labDetails, location: { location: labDetails.location.location, address: { ...labDetails.location.address, other: val } } })} labelClass='font-medium' />
                {/* <Input label='Phone *' value={labDetails.location.address.phone} onChange={val => setValues({ ...values, phone: val })} /> */}
                <Input label='Latitude' name='lat' placeholder='Enter latitude' value={labDetails.location.location.lat.toString()} onChange={(val) => onChange({ ...labDetails, location: { ...labDetails.location, location: { ...labDetails.location.location, lat: Number(val) } } })} labelClass='font-medium' containerClass='flex-1' />
                <Input label='Longitude' name='lang' placeholder='Enter longitude' value={labDetails.location.location.lang.toString()} onChange={(val) => onChange({ ...labDetails, location: { ...labDetails.location, location: { ...labDetails.location.location, lang: Number(val) } } })} labelClass='font-medium' containerClass='flex-1' />
            </div>
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2 border-gray-300/50'>
                Certification Information
                <div
                    className='ms-auto flex gap-2 font-semibold text-sm text-primary dark:text-white border-2 border-primary dark:border-white/60 px-4 py-2 rounded cursor-pointer'
                    onClick={() => setCetificationIndex({ index: labDetails?.certification?.length || 0 })}>
                    <div>New Entry</div>
                    <Image src={plusIcon} className='filter brightness-0 dark:invert' alt='' width={20} height={20} />
                </div>
            </div>
            <div className='border-2 border-gray-300/50 border-t-0 rounded'>
                <MainTable<Certification>
                    config={[
                        { heading: 'Organization', selector: 'organization' },
                        { heading: 'Year', selector: 'year' },
                        // { heading: 'Offer', selector: 'offer' },
                        {
                            heading: 'Actions',
                            component: ({ index }) => (<div className='flex items-center gap-1'>
                                <button onClick={() => setCetificationIndex({ index })}>
                                    Edit
                                </button>|
                                <button
                                    onClick={() => {
                                        const newCertification = [...(labDetails.certification || [])];
                                        newCertification.splice(index, 1);
                                        onChange({ ...labDetails, certification: newCertification });
                                    }}><TrashBinIcon /></button>
                            </div>)
                        }
                    ]}
                    data={labDetails.certification || []}
                    className='rounded text-sm border-0' />
                {certificationIndex && <CertificationModel
                    certificationDetails={labDetails?.certification?.[certificationIndex.index] ?? {}}
                    onClose={() => setCetificationIndex(null)}
                    onSave={certificate => {
                        const newCertificate = [...(labDetails.certification || [])];
                        newCertificate[certificationIndex.index] = certificate;
                        onChange({ ...labDetails, certification: newCertificate });
                        setCetificationIndex(null);
                    }} />}
            </div>
            <div className='pb-4 flex justify-between font-semibold mt-6 pt-5 border-t-2 border-gray-300/50'>
                Description
            </div>
            <RichTextEditor value={labDetails.description || ''} onChange={val => onChange({ ...labDetails, tempDescription: val })} />
            <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                <div className='font-medium text-primary dark:text-white h-10 flex justify-center items-center px-4 border-2 border-primary dark:border-white/60 rounded cursor-pointer' onClick={() => { }}>Cancel</div>
                <button
                    className='bg-primary dark:bg-white/25 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer'
                    onClick={async () => {
                        await onSave();
                    }}
                    disabled={loading}>{loading ? 'Saving..' : 'Save'}</button>
            </div>
        </div>
    )
}

export default AboutForm;


export type LabAboutDetails = {
    name: string,
    description?: string,
    tempDescription?: string,
    image?: string,
    location: {
        address: {
            pin: string,
            city: string,
            district: string,
            other: string, // road details 
        },
        location: {
            lat: number,
            lang: number
        }
    },
    certification?: Certification[],
}

type Certification = {
    organization?: string,
    year?: number,
    imageUrl?: string
}

function CertificationModel({ certificationDetails, onSave, onClose }: { certificationDetails?: Certification, onSave: (certification: Certification) => void, onClose: () => void }) {
    const [certification, setCetification] = useState<Certification>(certificationDetails || {
        organization: '',
        imageUrl: ''
    })

    return (
        <Model heading='Certification Details' onClose={onClose}>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm px-6 py-4 pb-2'>
                <Input label='Organization' name='organization' placeholder='Enter organization' value={certification?.organization || ''} onChange={(val) => setCetification({ ...certification, organization: val })} labelClass='font-medium' containerClass='flex-1' />
                <Input label='Year' name='year' placeholder='Enter year' value={certification?.year?.toString() || ''} onChange={(val) => setCetification({ ...certification, year: Number(val) })} labelClass='font-medium' containerClass='flex-1' />
                <Input label='Image URL' name='imageUrl' placeholder='Enter image URL' value={certification?.imageUrl || ''} onChange={(val) => setCetification({ ...certification, imageUrl: val })} labelClass='font-medium' containerClass='flex-1' />
            </div>
            <div className='p-5 pb-7 ms-auto justify-end items-end flex gap-4 px-6'>
                <div className='font-medium text-primary dark:text-white h-10 flex justify-center items-center px-4 border-2 border-primary dark:border-white/60 rounded cursor-pointer' onClick={() => { }}>Cancel</div>
                <div className='bg-primary dark:bg-white/25 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                    await onSave(certification);
                }}>Save</div>
            </div>
        </Model>
    )
}