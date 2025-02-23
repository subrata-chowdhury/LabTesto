import React from 'react'

const Loading = () => {
    return (
        <div className='bg-blue-50 p-1 md:py-9 md:px-10'>
            <BasicTestDetailsLoader />
            <div className='mt-1 md:mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-5 rounded-lg'>
                <LabLoader />
            </div>
            <div className='mt-1 md:mt-4 py-8 px-8 flex flex-col gap-5 rounded-lg border-2 bg-white'>
                <DetailsLoader />
            </div>
        </div>
    )
}

export default Loading

export function BasicTestDetailsLoader() {
    return (
        <div className='bg-white border-2 p-7 px-8 flex flex-col rounded-lg'>
            <div className='animate-pulse pb-6'>
                <div className='h-8 w-32 bg-gray-300 rounded'></div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                <div className='flex gap-4'>
                    <div className='font-medium flex gap-2'>
                        <div className='w-6 h-6 animate-pulse rounded bg-gray-300'></div>
                        <div className='h-6 w-32 animate-pulse rounded bg-gray-300'></div>
                    </div>
                    <div className='animate-pulse'>
                        <div className='h-full w-20 bg-gray-300 rounded'></div>
                    </div>
                </div>
                <div className='flex gap-4'>
                    <div className='font-medium flex gap-2'>
                        <div className='w-6 h-6 animate-pulse rounded bg-gray-300'></div>
                        <div className='h-6 w-32 animate-pulse rounded bg-gray-300'></div>
                    </div>
                    <div className='animate-pulse'>
                        <div className='h-full w-32 bg-gray-300 rounded'></div>
                    </div>
                </div>
                <div className='flex gap-4'>
                    <div className='font-medium flex gap-2'>
                        <div className='w-6 h-6 animate-pulse rounded bg-gray-300'></div>
                        <div className='h-6 w-32 animate-pulse rounded bg-gray-300'></div>
                    </div>
                    <div className='animate-pulse'>
                        <div className='h-full w-12 bg-gray-300 rounded'></div>
                    </div>
                </div>
                <div className='flex gap-4 items-center'>
                    <div className='font-medium flex gap-2'>
                        <div className='w-6 h-6 animate-pulse rounded bg-gray-300'></div>
                        <div className='h-6 w-32 animate-pulse rounded bg-gray-300'></div>
                    </div>
                    <div className='animate-pulse'>
                        <div className='h-full w-40 bg-gray-300 rounded'></div>
                    </div>
                </div>
            </div>
            <div className='bottom-0 flex items-center justify-between mt-3'>
                <div className='flex items-center gap-2'>
                    <div className='animate-pulse'>
                        <div className='h-8 w-32 bg-gray-300 rounded'></div>
                    </div>
                </div>
                <div className='bg-[rgba(57,134,186,0.8)] rounded-md animate-pulse w-20 h-10'></div>
            </div>
        </div>
    )
}

export function LabLoader() {
    return Array(4).fill(0).map((_, i) => (
        <div key={i} className='border-2 p-5 py-4 rounded-lg cursor-pointer flex justify-between bg-white'>
            <div className='flex items-center gap-3'>
                <div className='w-14 h-14 bg-[rgba(57,134,186,0.2)] animate-pulse rounded-md flex items-center justify-center'>
                    {/* <Image src='/download.png' alt='' width={115} height={50} /> */}
                </div>
                <div className='animate-pulse'>
                    <div className='font-semibold w-28 h-5 rounded mb-1 bg-gray-300'></div>
                    <div className='flex w-40 h-6 bg-gray-300 items-center gap-2 rounded'></div>
                </div>
            </div>
        </div>
    ))
}

export function DetailsLoader() {
    return Array(4).fill(0).map((_, i) => (
        <div key={i} className='flex gap-2'>
            <div className='w-6 h-6 animate-pulse rounded bg-gray-300'></div>
            <div className='flex flex-1 flex-col gap-1'>
                <p className='w-32 h-4 my-1 animate-pulse rounded bg-gray-300'></p>
                <div className='flex flex-col gap-[2px]'>
                    <p className='min-w-52 w-full h-4 animate-pulse rounded bg-gray-300'></p>
                    <p className='min-w-52 w-full h-4 animate-pulse rounded bg-gray-300'></p>
                    <p className='min-w-28 h-4 animate-pulse rounded bg-gray-300'></p>
                </div>
            </div>
        </div>
    ))
}