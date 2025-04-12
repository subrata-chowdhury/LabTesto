import { MainTable } from '@/components/Table'
import Image from 'next/image'
import React, { useState } from 'react'
import plusIcon from '@/assets/blue-plus.svg'
import TrashBinIcon from '@/assets/reactIcon/TrashBin'
import Model from '@/components/Model'
import TagInput from '@/components/Inputs/TagInput'
import Input from '@/components/Inputs/Input'
import SelectTest from '@/app/components/SelectTest'
import { toast } from 'react-toastify'
import fetcher from '@/lib/fetcher'
import { useParams } from 'next/navigation'

type Props = {
    labDetails: LabTestDetails,
    loading?: boolean,
    error: { field: string, msg: string } | null,
    onChange: {
        labDetails: (labDetails: LabTestDetails) => void
    },
    onSave: () => void
}

const LabForm = ({ labDetails, loading, onChange, onSave = () => { } }: Props) => {
    const [showTestDetailsPopup, setShowTestDetailsPopup] = useState<{ index: number } | null>(null);
    const { id } = useParams();

    return (
        <div className='bg-white mt-4 p-8 px-10'>
            <div className='text-xl flex gap-3 items-center font-bold pb-6'>
                Tests Lab Form of <span className='text-blue-600'>{labDetails.name}</span>
            </div>
            <div className='pb-4 flex justify-between font-semibold'>
                Test Details
                <div
                    className='ms-auto flex gap-2 font-semibold text-sm text-blue-500 border-2 border-blue-500 px-4 py-2 rounded cursor-pointer'
                    onClick={() => setShowTestDetailsPopup({ index: labDetails.details?.length || 0 })}>
                    <div>New Entry</div>
                    <Image src={plusIcon} alt='' width={20} height={20} />
                </div>
            </div>
            <div className='border-2 border-t-0 rounded'>
                <MainTable<TestsDetails>
                    config={[
                        { heading: 'Test', selector: 'name' },
                        { heading: 'Price', selector: 'name', component: ({ data }) => data.price },
                        { heading: 'Offer', selector: 'name', component: ({ data }) => data.offer },
                        {
                            heading: 'Actions',
                            component: ({ index, data }) => (<div className='flex items-center gap-1'>
                                <button onClick={() => setShowTestDetailsPopup({ index })}>
                                    Edit
                                </button>|
                                <button
                                    onClick={() => {
                                        const deleteTestData = async () => fetcher.delete<{ test: string }, { messege: string } | string>(`/admin/labs/tests/${id}`, { test: data.test }).then((res) => {
                                            if (res.status === 200 && res.body) {
                                                const newTestDetails = [...(labDetails.details || [])];
                                                newTestDetails.splice(index, 1);
                                                onChange.labDetails({ ...labDetails, details: newTestDetails });
                                            } else if (res.status === 404 && res.body == 'Lab test details not found') {
                                                const newTestDetails = [...(labDetails.details || [])];
                                                newTestDetails.splice(index, 1);
                                                onChange.labDetails({ ...labDetails, details: newTestDetails });
                                            } else throw new Error('Failed to delete test data')
                                        })
                                        toast.promise(
                                            deleteTestData(),
                                            {
                                                pending: 'Deleting test data...',
                                                success: 'Test Data deleted successfully',
                                                error: 'Failed to delete test data',
                                            }
                                        )
                                    }}><TrashBinIcon /></button>
                            </div>)
                        }
                    ]}
                    data={labDetails.details || []}
                    className='rounded text-sm border-0' />
                {
                    showTestDetailsPopup && <TestDetailsPopup
                        details={(labDetails.details || [])[showTestDetailsPopup.index]}
                        onClose={() => setShowTestDetailsPopup(null)}
                        onSave={details => {
                            const newLabDetails = { name: labDetails?.name, details: labDetails.details || [] };
                            newLabDetails.details[showTestDetailsPopup.index] = details;
                            onChange.labDetails(newLabDetails);
                            setShowTestDetailsPopup(null)
                        }} />
                }
            </div>

            <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={() => { }}>Cancel</div>
                <button className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => { await onSave(); }} disabled={loading}>{loading ? 'Saving..' : 'Save'}</button>
            </div>
        </div>
    )
}

export default LabForm;

export type LabTestDetails = {
    name?: string
    details?: TestsDetails[]
}

type TestsDetails = {
    test: string,
    name?: string
    price: number,
    offer?: number,
    expenses?: number,
    resultTime: string,
    packages?: string[],
    ranges?: Map<string, string>
}

function TestDetailsPopup({ details, onClose, onSave }: { details: TestsDetails, onClose: () => void, onSave: (details: TestsDetails) => void }) {
    const [testDetails, setTestDetails] = useState(details);
    const [error, setError] = useState<{ [key: string]: string }>({})

    return (
        <Model className='max-w-[90%]' heading='Test Details' onClose={onClose}>
            <div className='text-sm p-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input label='Price' name='price' type='number' placeholder='Enter Price' value={testDetails?.price?.toString() || ''} onChange={(val) => setTestDetails({ ...testDetails, price: Number(val) })} labelClass='font-medium' containerClass='flex-1' error={error?.price ? error.price : ""} />
                <Input label='Offer' name='offer' type='number' placeholder='Enter Offer' value={testDetails?.offer?.toString() || ''} onChange={(val) => setTestDetails({ ...testDetails, offer: Number(val) })} labelClass='font-medium' containerClass='flex-1' error={error?.offer ? error.offer : ""} />
                <Input label='Expenses' name='expenses' type='number' placeholder='Enter Expenses' value={testDetails?.expenses?.toString() || ''} onChange={(val) => setTestDetails({ ...testDetails, expenses: Number(val) })} labelClass='font-medium' containerClass='flex-1' error={error?.expenses ? error.expenses : ""} />
                <Input label='Result Time' name='resultTime' placeholder='Enter Result Time' value={testDetails?.resultTime || ''} onChange={(val) => setTestDetails({ ...testDetails, resultTime: val })} labelClass='font-medium' containerClass='flex-1' error={error?.resultTime ? error.resultTime : ""} />
            </div>
            <div className='text-sm p-6 py-0'>
                <TagInput
                    label='Packages *'
                    values={testDetails?.packages}
                    onChange={(val) => setTestDetails(prevVal => ({ ...prevVal, packages: val }))}
                />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 pt-2 text-sm'>
                <label className="flex flex-col gap-1">
                    Test *
                    <SelectTest
                        onSelect={val => setTestDetails(prevVal => ({ ...prevVal, test: val._id, name: val.name }))} />
                </label>
            </div>
            <div className='p-6 pt-2 ms-auto justify-end items-end flex gap-4'>
                <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={onClose}>Cancel</div>
                <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => {
                    const errors: { [key: string]: string } = {};

                    if (!testDetails.price || testDetails.price <= 0) {
                        errors.price = "Price must be greater than 0";
                    }

                    if (!testDetails.offer || testDetails.offer <= 0) {
                        errors.offer = "Offer cannot be negative";
                    }

                    if (!testDetails.expenses || testDetails.expenses <= 0) {
                        errors.expenses = "Expenses cannot be negative";
                    }

                    if (!testDetails.resultTime || testDetails.resultTime.trim() === "") {
                        errors.resultTime = "Result Time is required";
                    }

                    if (!testDetails.packages || testDetails.packages.length === 0) {
                        errors.packages = "At least one package is required";
                    }

                    if (!testDetails.test || testDetails.test.length === 0) {
                        toast.warning("Please Select a Test");
                        errors.test = "Please Select a Test";
                    }

                    if (Object.keys(errors).length > 0) {
                        setError(errors);
                        return;
                    }

                    setError({});
                    await onSave(testDetails);
                    onClose();
                }}>Save</div>
            </div>
        </Model>
    )
}