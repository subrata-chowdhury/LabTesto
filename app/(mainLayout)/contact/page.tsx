import React from 'react'
import Image from 'next/image'
import Head from 'next/head'
import MainForm from './components/MainContactForm'
import ContactDetails from './components/ContactDetails'

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
                <Image src={'/wave.svg'} width={960} height={540} alt="" className='w-full opacity-75 blur-sm object-cover h-screen absolute -z-10 top-0 rotate-180 bg-transparent' />
                <div className='text-4xl text-white font-bold mt-6'>Get In Touch</div>
                <div className='text-gray-100 text-center mt-2'>Whether you have questions or you would just like to say hello, contact us.</div>
            </div>
            <div className='w-11/12 sm:w-fit -translate-y-1/4 lg:-translate-y-2/4 mx-auto flex flex-col lg:flex-row gap-4'>

                <div className='rounded-lg flex flex-col px-6 py-5 bg-primary bg-opacity-70 text-white'>
                    <div className='text-2xl font-semibold mb-5 lg:mb-0'>Contact Information</div>
                    <ContactDetails />
                </div>
                <MainForm />
            </div>
        </>
    )
}

export default ContactPage;
