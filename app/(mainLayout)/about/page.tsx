import Link from 'next/link';
import React from 'react'
import { Achivements } from '../page';
import ContactDetails from '../contact/components/ContactDetails';
import Services from '../services/components/Services';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us - LabTesto',
}

function AboutPage() {
    return (
        <>
            <section className='h-screen'>
                <div className='flex flex-wrap gap-12 md:gap-0 px-8 xl:px-1 h-[calc(100vh-120px)] items-center justify-between'>
                    <div className='my-auto mt-6 md:mt-auto flex flex-col mx-auto'>
                        <h1 className='text-5xl lg:text-6xl font-light'>Get Quick<br /> <span className='font-extrabold'>Tests Done</span></h1>
                        <p className="mt-4 text-sm lg:text-base text-gray-600 dark:text-gray-400">A trusted diagnostic platform offering secure,<br /> convenient access to accredited labs and<br /> professional sample collection.</p>
                        <Link href='/signup' className='px-5 py-2.5 text-lg bg-primary text-white rounded w-fit mt-8 group overflow-hidden relative hover:text-primary border hover:border-primary transition-all duration-300'>
                            <div className='bg-white transition-all duration-500 w-0 h-0 top-0 left-0 rounded-full group-hover:w-[180%] group-hover:h-[120px] absolute group-hover:-top-[25%] group-hover:-left-[25%]'></div>
                            <p className='relative z-20'>Get Started</p>
                        </Link>
                    </div>
                    <div className='w-64 h-64 sm:w-72 sm:h-72 lg:w-96 lg:h-96 relative mx-auto flex justify-center items-center rounded-full shadow-md bg-primary/30 text-4xl sm:text-5xl font-bold'>
                        <span className="text-orange-500">Lab</span><span className="text-blue-600">Testo</span>
                        <div className='text-base lg:text-xl flex gap-3 border border-gray-300 dark:border-gray-600 dark:shadow-gray-900 absolute top-8 -left-10 sm:-left-16 bg-white dark:bg-[#172A46] shadow-xl px-3 sm:px-3.5 py-2 sm:py-2.5 lg:px-5 lg:py-4 pr-8 leading-5 rounded-md'>
                            <div className='h-10 w-10 rounded bg-primary/25'></div>
                            <div>
                                <div>1820+</div>
                                <div className='text-xs lg:text-sm font-normal text-gray-500 dark:text-gray-400'>Active Users</div>
                            </div>
                        </div>
                        <div className='text-base lg:text-xl flex gap-3 border border-gray-300 dark:border-gray-600 dark:shadow-gray-900 absolute bottom-10 lg:bottom-16 -right-14 sm:-right-24 bg-white dark:bg-[#172A46] shadow-xl px-3 sm:px-3.5 py-2 sm:py-2.5 lg:px-5 lg:py-4 pr-4 sm:pr-8 leading-5 rounded-md'>
                            {/* <div className='h-10 w-10 rounded bg-primary bg-opacity-25'></div> */}
                            <ul className=' list-disc pl-4'>
                                {/* <div>1820+</div> */}
                                <li className='text-xs lg:text-sm font-normal text-gray-500 dark:text-gray-400'>Get Sample Collected<br /> at your Home</li>
                                <li className='text-xs lg:text-sm font-normal text-gray-500 dark:text-gray-400'>Also get Report on your Home</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section className='mt-8 mb-12 sm:mt-2 md:-mt-14'>
                <Services />
            </section>
            <div className='mx-5'>
                <Achivements />
            </div>
            <section className="mx-auto md:w-[95%] pt-0 sm:pt-0 md:pt-0 p-4 flex flex-col">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mx-auto mt-4">Our Contact Details</h1>
                <div className="w-20 h-1 rounded-full mx-auto bg-black/20 dark:bg-white/30 my-3"></div>
                <div className='mx-10 my-12 '>
                    <ContactDetails className='flex-wrap justify-between' iconClassName='border border-gray-300/60 shadow-md' />
                </div>
            </section>
        </>
    )
}

export default AboutPage;