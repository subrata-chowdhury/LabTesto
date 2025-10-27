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
            <div className='flex flex-col relative items-center pb-12 mb-6 bg-primary'>
                {/* <Image src={'/wave.svg'} width={960} height={540} alt="" className='w-full opacity-75 blur-sm object-cover h-screen absolute -z-10 top-0 rotate-180 bg-transparent' /> */}
                <div className='text-4xl md:text-6xl text-white text-center font-bold mt-18'>We'd Love to Hear From You</div>
                <div className='text-white text-center text-lg mt-4 mb-2 mx-4'>Whether you have questions or you would just like to say hello, contact us.</div>
                <svg className="w-full h-20 absolute bottom-0 translate-y-1/2" viewBox="0 0 1200 40" preserveAspectRatio="none">
                    <path
                        d="M0,0 L50,10 L100,5 L150,15 L200,8 L250,12 L300,5 L350,15 L400,10 L450,5 L500,12 L550,8 L600,15 L650,10 L700,5 L750,12 L800,8 L850,15 L900,5 L950,12 L1000,8 L1050,15 L1100,10 L1150,5 L1200,12 L1200,40 L0,40 Z"
                        fill="white"
                    />
                </svg>
            </div>
            <ContactDetails />
            <div className='sm:w-fit mx-auto flex flex-col lg:flex-row gap-4 mb-8'>
                <MainForm />
                <div className='flex flex-col'>
                    <h2 className={"text-2xl font-bold text-primary mb-4"}>Find Us</h2>
                    <div className={"bg-gray-200 rounded-lg overflow-hidden mb-6"}>
                        <iframe
                            src="https://www.google.com/maps?q=23.432055556,87.274694444&z=15&output=embed"
                            width="400"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactPage;
