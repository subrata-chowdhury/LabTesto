import React from 'react'
import phoneIcon from '@/assets/phone.svg'
import mailIcon from '@/assets/mail.svg'
import locationIcon from '@/assets/location.svg'
import Image from 'next/image'
import Head from 'next/head'
import MainForm from './components/MainContactForm'
import { PhoneIcon } from '@/assets/reactIcon/contact/Phone'
import { MailIcon } from '@/assets/reactIcon/contact/Mail'
import { LocationIcon } from '@/assets/reactIcon/contact/Location'

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

export function ContactDetails({ className = "flex-col", iconClassName }: { className?: string , iconClassName?: string}) {
    return (
        <div className={'flex gap-8 my-auto ' + className}>
            <div className='flex items-center gap-4'>
                <div className={'p-4 bg-white rounded-full shadow text-black ' + iconClassName}>
                    <PhoneIcon />
                </div>
                <div>
                    <div className='font-bold'>Phone</div>
                    +91 82507 11212
                </div>
                {/* <Image src={phoneIcon} alt="Phone Icon" /> */}
            </div>
            <div className='flex items-center gap-4'>
                <div className={'p-4 bg-white rounded-full shadow text-black ' + iconClassName}>
                    <MailIcon />
                </div>
                {/* <Image src={mailIcon} alt="Mail Icon" /> */}
                <div>
                    <div className='font-bold'>Email</div>
                    sayan825071das@gmail.com
                </div>
            </div>
            <div className='flex items-center gap-4'>
                <div className={'p-4 bg-white rounded-full shadow text-black ' + iconClassName}>
                    <LocationIcon />
                </div>
                {/* <Image src={locationIcon} alt="Location Icon" width={30} height={30} /> */}
                <div>
                    <div className='font-bold'>Location</div>
                    Kadasole more, Bankura, <br />Pin.: 722202 - West Bengal
                </div>
            </div>
        </div>
    )
}