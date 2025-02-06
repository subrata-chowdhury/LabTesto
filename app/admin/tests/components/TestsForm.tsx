"use client"
import Dropdown from '@/components/Dropdown'
import Input from '@/components/Inputs/Input'
import React from 'react'
import Image from 'next/image'
// import CheckBox from '@/components/Inputs/CheckBox'
import Title from '@/components/Title'
import informationIcon from '@/assets/information.svg'

type Props = {
    testDetails: TestDetails,
    error?: { field: string, msg: string } | null,
    onChange: {
        testDetails: (testDetails: TestDetails) => void,
    },
    onSave: () => void
}

const TestForm = ({ testDetails, error, onChange, onSave = () => { } }: Props) => {
    return (
        <div className='bg-white mt-4 p-8 px-10'>
            <div className='text-xl flex gap-3 items-center font-bold pb-6'>
                Test Form
                <Title title={<p className='text-nowrap font-medium'>Fill in the details for the test</p>}>
                    <Image src={informationIcon} alt="" width={20} height={20} />
                </Title>
            </div>
            <div className='pb-4 font-semibold'>Test Information</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                <Input label='Name *' name='name' placeholder='Enter name' value={testDetails.name} onChange={(val) => onChange.testDetails({ ...testDetails, name: val })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'name' ? error.msg : ""} />
                <div className='flex flex-col gap-1'>
                    <p className='font-medium'>Sample Type</p>
                    <Dropdown options={['Blood', 'Urine', 'Semen', 'Stool', 'Sputum', 'Other body fluid']} value={testDetails.sampleType} onChange={(val) => onChange.testDetails({ ...testDetails, sampleType: val as 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other body fluid' })} width={'100%'} />
                </div>
                <div className='flex flex-col gap-1'>
                    <p className='font-medium'>Tube Type</p>
                    <Dropdown options={['Clot/Plain tube (red color cap)', 'Fluoride/Sugar tube (gray color cap)', 'EDTA tube (purple color cap)', 'Citrate tube (blue color cap)']} value={testDetails.tubeType} onChange={(val) => onChange.testDetails({ ...testDetails, tubeType: val as 'Clot/Plain tube (red color cap)' | 'Fluoride/Sugar tube (gray color cap)' | 'EDTA tube (purple color cap)' | 'Citrate tube (blue color cap)' })} width={'100%'} />
                </div>
                <Input label='Fasting Required *' name='fastingRequired' placeholder='Enter fasting requirement' value={testDetails.fastingRequired} onChange={(val) => onChange.testDetails({ ...testDetails, fastingRequired: val })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'fastingRequired' ? error.msg : ""} />
                <Input label='Result Time *' name='resultTime' placeholder='Enter result time' value={testDetails.resultTime} onChange={(val) => onChange.testDetails({ ...testDetails, resultTime: val })} labelClass='font-medium' containerClass='flex-1' error={error?.field === 'resultTime' ? error.msg : ""} />
            </div>
            <div className='text-sm flex flex-col gap-1 pt-4'>
                <label className='font-medium'>Description</label>
                <textarea className='border-2 rounded w-full h-20 p-2 outline-none' rows={5} placeholder='Enter Description' value={testDetails.description} onChange={(e) => onChange.testDetails({ ...testDetails, description: e.target.value })}></textarea>
            </div>
            <div className='text-sm flex flex-col gap-1 pt-4'>
                <label className='font-medium'>Overview *</label>
                <textarea className='border-2 rounded w-full h-20 p-2 outline-none' rows={5} placeholder='Enter Overview' value={testDetails.overview} onChange={(e) => onChange.testDetails({ ...testDetails, overview: e.target.value })}></textarea>
            </div>
            <div className='text-sm flex flex-col gap-1 pt-4'>
                <label className='font-medium'>Test Result Interpretation *</label>
                <textarea className='border-2 rounded w-full h-20 p-2 outline-none' rows={5} placeholder='Enter Test Result Interpretation' value={testDetails.testResultInterpretation} onChange={(e) => onChange.testDetails({ ...testDetails, testResultInterpretation: e.target.value })}></textarea>
            </div>
            <div className='text-sm flex flex-col gap-1 pt-4'>
                <label className='font-medium'>Risk Assessment *</label>
                <textarea className='border-2 rounded w-full h-20 p-2 outline-none' rows={5} placeholder='Enter Risk Assessment' value={testDetails.riskAssesment} onChange={(e) => onChange.testDetails({ ...testDetails, riskAssesment: e.target.value })}></textarea>
            </div>
            <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={() => { }}>Cancel</div>
                <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => { await onSave(); }}>Save</div>
            </div>
        </div>
    )
}

export default TestForm;

export type TestDetails = {
    name: string,
    sampleType: 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other body fluid',
    tubeType: 'Clot/Plain tube (red color cap)' | 'Fluoride/Sugar tube (gray color cap)' | 'EDTA tube (purple color cap)' | 'Citrate tube (blue color cap)',
    description: string,
    fastingRequired: string,
    overview: string,
    testResultInterpretation: string,
    riskAssesment: string,
    resultTime: string
}
