import React from 'react'
import phoneIcon from '@/assets/phone.svg'
import mailIcon from '@/assets/mail.svg'
import locationIcon from '@/assets/location.svg'
import Image from 'next/image'
import Head from 'next/head'
import MainForm from './components/page'

function ContactPage() {
    return (
        <>
            <Head>
                <title>Contact Us - LabTesto</title>
                <meta name="description" content="Get in touch with LabTesto. Whether you have questions or you would just like to say hello, contact us." />
                <meta name="keywords" content="contact, LabTesto, questions, hello, get in touch" />
                <meta name="author" content="LabTesto" />
            </Head>
            <div className='h-96 flex flex-col relative items-center'>
                <Image src={'/wave.svg'} width={960} height={540} alt="" className='w-full absolute -z-10 top-0 rotate-180 bg-transparent' />
                <div className='text-4xl text-white font-bold mt-6'>Get In Touch</div>
                <div className='text-gray-300 text-center mt-2'>Whether you have questions or you would just like to say hello, contact us.</div>
            </div>
            <div className='border-2 border-primary border-opacity-30 bg-white dark:bg-[#172A46] w-11/12 sm:w-fit -translate-y-1/4 lg:-translate-y-2/4 mx-auto flex flex-col lg:flex-row gap-4 rounded-xl p-3'>
                <div className='rounded-lg flex flex-col px-6 py-5 bg-primary bg-opacity-70 text-white'>
                    <div className='text-2xl font-semibold'>Contact Information</div>
                    <div className='flex-1 flex flex-col gap-3 mt-5'>
                        <div className='flex items-center gap-2 mt-4'>
                            <Image src={phoneIcon} alt="Phone Icon" />
                            +91 82507 11212
                        </div>
                        <div className='flex items-center gap-2 mt-4'>
                            <Image src={mailIcon} alt="Mail Icon" />
                            sayan825071das@gmail.com
                        </div>
                        <div className='flex items-center gap-2 mt-4'>
                            <Image src={locationIcon} alt="Location Icon" width={30} height={30} />
                            Kadasole more, Bankura, <br />Pin.: 722202 - West Bengal
                        </div>
                    </div>
                </div>
                <MainForm />
            </div>
        </>
    )
}

export default ContactPage;