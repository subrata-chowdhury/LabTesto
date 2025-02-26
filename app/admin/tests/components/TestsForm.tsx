"use client"
import Dropdown from '@/components/Dropdown'
import Input from '@/components/Inputs/Input'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
// import CheckBox from '@/components/Inputs/CheckBox'
import Title from '@/components/Title'
import informationIcon from '@/assets/information.svg'
import TagInput from '@/components/Inputs/TagInput'
import RichTextEditor from '@/app/components/RichTextEditor'
import { toast } from 'react-toastify'

type Props = {
    testDetails: TestDetails,
    loading?: boolean,
    error?: { [key in keyof TestDetails]?: string } | null,
    onChange: {
        testDetails: (testDetails: TestDetails) => void,
    },
    onSave: () => void
}

const TestForm = ({ testDetails, loading, error, onChange, onSave = () => { } }: Props) => {
    const nameInputRef = useRef<HTMLInputElement>(null);
    const sampleTypeInputRef = useRef<HTMLDivElement>(null);
    const tubeTypeInputRef = useRef<HTMLDivElement>(null);
    const fastingInputRef = useRef<HTMLInputElement>(null);
    const overviewInputRef = useRef<HTMLInputElement>(null);
    const testResultInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (error) {
            if (error.name) {
                nameInputRef.current?.focus();
                nameInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                toast.error(error.name);
            }
            if (error.sampleType) {
                sampleTypeInputRef.current?.focus();
                sampleTypeInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                toast.error(error.sampleType);
            }
            if (error.tubeType) {
                tubeTypeInputRef.current?.focus();
                tubeTypeInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                toast.error(error.tubeType);
            }
            if (error.fastingRequired) {
                fastingInputRef.current?.focus();
                fastingInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                toast.error(error.fastingRequired);
            }
            if (error.overview) {
                overviewInputRef.current?.focus();
                overviewInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                toast.error(error.overview);
            }
            if (error.testResultInterpretation) {
                testResultInputRef.current?.focus();
                testResultInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                toast.error(error.testResultInterpretation);
            }
        }
    }, [error])

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
                <Input label='Name *' name='name' placeholder='Enter name' value={testDetails.name} onChange={(val) => onChange.testDetails({ ...testDetails, name: val })} labelClass='font-medium' containerClass='flex-1' ref={nameInputRef} error={error?.name ? error.name : ""} />
                <div className='flex flex-col gap-1'>
                    <p className='font-medium'>Sample Type *</p>
                    <Dropdown options={['Blood', 'Urine', 'Semen', 'Stool', 'Sputum', 'Other Body Fluid']} value={testDetails.sampleType} onChange={(val) => onChange.testDetails({ ...testDetails, sampleType: val.value as 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other Body Fluid' })} width={'100%'} ref={sampleTypeInputRef} />
                    {(error?.sampleType && error?.sampleType?.length > 0) && <p className="text-red-500 text-xs font-medium">{error.sampleType}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                    <p className='font-medium'>Tube / Container Type *</p>
                    <Dropdown options={['Clot Tube', 'Fluoride Tube', 'EDTA Tube', 'Citrate Tube', 'Sterile Container', 'Non-Sterile Container']} value={testDetails.tubeType} onChange={(val) => onChange.testDetails({ ...testDetails, tubeType: val.value as 'Clot Tube' | 'Fluoride Tube' | 'EDTA Tube' | 'Citrate Tube' | 'Sterile Container' | 'Non-Sterile Container' })} width={'100%'} ref={tubeTypeInputRef} />
                    {(error?.tubeType && error?.tubeType?.length > 0) && <p className="text-red-500 text-xs font-medium">{error.tubeType}</p>}
                </div>
                <Input label='Fasting Required' name='fastingRequired' placeholder='Enter fasting requirement' value={testDetails.fastingRequired} onChange={(val) => onChange.testDetails({ ...testDetails, fastingRequired: val })} labelClass='font-medium' containerClass='flex-1' error={error?.fastingRequired ? error.fastingRequired : ""} ref={fastingInputRef} />
            </div>
            <div className='flex flex-col gap-1 mt-4'>
                <p className='font-medium text-sm'>Other Terms / Tags</p>
                <TagInput values={testDetails.otherTerms} onChange={(values) => onChange.testDetails({ ...testDetails, otherTerms: values })} />
            </div>
            <div className='text-sm flex flex-col gap-1 pt-4' ref={overviewInputRef}>
                <label className='font-medium'>Overview *</label>
                <RichTextEditor value={testDetails.overview} onChange={(val) => onChange.testDetails({ ...testDetails, tempOverview: val })} />
                {/* <textarea className='border-2 rounded w-full h-20 p-2 outline-none' rows={5} placeholder='Enter Overview' value={testDetails.overview} onChange={(e) => onChange.testDetails({ ...testDetails, overview: e.target.value })}></textarea> */}
                {(error?.overview && error?.overview?.length > 0) && <p className="text-red-500 text-xs font-medium">{error.overview}</p>}
            </div>
            <div className='text-sm flex flex-col gap-1 pt-4' ref={testResultInputRef}>
                <label className='font-medium'>Test Result Interpretation *</label>
                <RichTextEditor value={testDetails.testResultInterpretation} onChange={(val) => onChange.testDetails({ ...testDetails, tempTestResultInterpretation: val })} />
                {/* <textarea className='border-2 rounded w-full h-20 p-2 outline-none' rows={5} placeholder='Enter Test Result Interpretation' value={testDetails.testResultInterpretation} onChange={(e) => onChange.testDetails({ ...testDetails, testResultInterpretation: e.target.value })}></textarea> */}
                {(error?.testResultInterpretation && error?.testResultInterpretation?.length > 0) && <p className="text-red-500 text-xs font-medium">{error.testResultInterpretation}</p>}
            </div>
            <div className='text-sm flex flex-col gap-1 pt-4'>
                <label className='font-medium'>Risk Assessment</label>
                <RichTextEditor value={testDetails.riskAssesment} onChange={(val) => onChange.testDetails({ ...testDetails, tempRiskAssesment: val })} />
                {/* <textarea className='border-2 rounded w-full h-20 p-2 outline-none' rows={5} placeholder='Enter Risk Assessment' value={testDetails.riskAssesment || ''} onChange={(e) => onChange.testDetails({ ...testDetails, riskAssesment: e.target.value })}></textarea> */}
            </div>
            <div className='text-sm flex flex-col gap-1 pt-4'>
                <label className='font-medium'>Description</label>
                <RichTextEditor value={testDetails.description} onChange={(val) => onChange.testDetails({ ...testDetails, tempDescription: val })} />
                {/* <textarea className='border-2 rounded w-full h-20 p-2 outline-none' rows={5} placeholder='Enter Description' value={testDetails.description} onChange={(e) => onChange.testDetails({ ...testDetails, description: e.target.value })}></textarea> */}
            </div>
            <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={() => { }}>Cancel</div>
                <button className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => { await onSave(); }} disabled={loading}>{loading ? 'Saving..' : 'Save'}</button>
            </div>
        </div>
    )
}

export default TestForm;

export type TestDetails = {
    name: string,
    otherTerms: string[],
    sampleType: 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other Body Fluid',
    tubeType: 'Clot Tube' | 'Fluoride Tube' | 'EDTA Tube' | 'Citrate Tube' | 'Sterile Container' | 'Non-Sterile Container',
    fastingRequired: string,
    description: string,
    overview: string,
    testResultInterpretation: string,
    riskAssesment: string,

    tempDescription?: string,
    tempOverview?: string,
    tempTestResultInterpretation?: string,
    tempRiskAssesment?: string,
}
