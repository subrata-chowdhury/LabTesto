'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import information from '@/assets/information.svg'
import Image from 'next/image'

function Test() {
    const [testDetails, setTestDetails] = useState({
        name: 'Test',
        type: 'Blood Test',
        description: 'It is a test',
        price: 0,
        duration: '1min',
        preparation: 'No advance preparation required',
        sampleType: '',
        resultTime: ''
    })
    const { id } = useParams<{ id: string }>();

    useEffect(() => {

    }, [id])

    async function getTestDetails(id: string) {
        const res = await fetch(`/api/tests/${id}`);
        const data = await res.json();
        setTestDetails(data);
    }

    return (
        <div className='bg-blue-100 py-9 px-12'>
            <div className='bg-white p-8 px-10 rounded-md'>
                <div className='text-xl font-bold pb-6'>Test Details</div>
                <div className='pb-4 font-semibold'>Test Information</div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='flex flex-col gap-1'>
                        <p className='font-medium'>Name</p>
                        <p className='text-gray-500'>{testDetails.name}</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='font-medium'>Type</p>
                        <p className='text-gray-500'>{testDetails.type}</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='font-medium'>Duration</p>
                        <p className='text-gray-500'>{testDetails.duration}</p>
                    </div>
                </div>
                <div className='pt-4'>
                    <div className='flex flex-col gap-1'>
                        <p className='font-medium'>Description</p>
                        <p className='text-gray-500'>{testDetails.description}</p>
                    </div>
                </div>
                <div className='pb-4 font-semibold mt-6 pt-5 border-t-2 flex gap-3'>
                    Precautions
                    <Image src={information} alt='information' width={20} height={20} />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='flex flex-col gap-1'>
                        <p className='font-medium'>Advance Preparation</p>
                        <p className='text-gray-500'>{testDetails.preparation}</p>
                    </div>
                </div>
                <div className='pb-4 font-semibold mt-6 pt-5 border-t-2'>Order Details</div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <button className='px-4 pl-3 py-2 bg-blue-500 text-white rounded-md mr-auto flex gap-2'><TickIcon />Add to Cart</button>
                </div>
            </div>
        </div>
    )
}

export default Test;

function TickIcon() {
    return (
        <div className='relative'>
            <svg className='m-[3px]' width="18" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path id="Vector" d="M16.25 0H2.75C1.50736 0 0.5 1.00736 0.5 2.25V15.75C0.5 16.9926 1.50736 18 2.75 18H16.25C17.4926 18 18.5 16.9926 18.5 15.75V2.25C18.5 1.00736 17.4926 0 16.25 0Z" fill="blue" />
            </svg>

            <svg className='absolute top-0 m-[4px]' width="16" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Interface, Essential/Done, Check">
                    <g id="Group">
                        <g id="Group_2">
                            <path id="Path" d="M13.8357 4.33203L6.50237 11.6654L3.16904 8.33203" stroke="white" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    )
}