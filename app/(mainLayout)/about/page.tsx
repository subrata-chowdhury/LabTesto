import Link from 'next/link';
import React from 'react'

function AboutPage() {
    return (
        <>
            <div className='h-screen'>
                <div className='flex px-28 h-[calc(100vh-120px)] items-center justify-between'>
                    <div className='my-auto flex flex-col'>
                        <h1 className='text-6xl font-light'>Get Quick<br /> <span className='font-extrabold'>Tests Done</span></h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">A well known trusted blood collection website<br /> to book any tests from any lab by user&#39;s choice.</p>
                        <Link href='/signup' className='px-5 py-2.5 text-lg bg-primary text-white rounded w-fit mt-8'>Get Started</Link>
                    </div>
                    <div className='w-96 h-96 relative flex justify-center items-center rounded-full bg-opacity-30 shadow-md bg-primary text-5xl font-bold'>
                        <span className="text-orange-500">Lab</span><span className="text-blue-600">Testo</span>
                        <div className='text-xl flex gap-3 border dark:border-gray-600 dark:shadow-gray-900 absolute top-8 -left-16 bg-white dark:bg-[#172A46] shadow-xl px-5 py-4 pr-8 leading-5 rounded-md'>
                            <div className='h-10 w-10 rounded bg-primary bg-opacity-25'></div>
                            <div>
                                <div>1820+</div>
                                <div className='text-sm font-normal text-gray-500 dark:text-gray-400'>Active Users</div>
                            </div>
                        </div>
                        <div className='text-xl flex gap-3 border dark:border-gray-600 dark:shadow-gray-900 absolute bottom-16 -right-20 bg-white dark:bg-[#172A46] shadow-xl px-5 py-4 pr-8 leading-5 rounded-md'>
                            {/* <div className='h-10 w-10 rounded bg-primary bg-opacity-25'></div> */}
                            <ul className=' list-disc pl-4'>
                                {/* <div>1820+</div> */}
                                <li className='text-sm font-normal text-gray-500 dark:text-gray-400'>Get Sample Collected<br /> at your Home</li>
                                <li className='text-sm font-normal text-gray-500 dark:text-gray-400'>Also get Report on your Home</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-screen'>

            </div>
        </>
    )
}

export default AboutPage;