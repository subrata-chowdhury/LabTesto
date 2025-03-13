'use client'
import React, { useState } from 'react'
import phoneIcon from '@/assets/phone.svg'
import mailIcon from '@/assets/mail.svg'
import locationIcon from '@/assets/location.svg'
import Image from 'next/image'
import fetcher from '@/lib/fetcher'
import { toast } from 'react-toastify'

function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    async function sendData() {
        const res = await fetcher.post('/contact', formData);
        if(res.status === 200) {
            toast.success('Details are send successfully');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        }
    }

    return (
        <div>
            <div className='h-96 bg-primary bg-opacity-15 flex flex-col items-center px-4 py-3'>
                <div className='text-4xl text-primary font-bold mt-6'>Get In Touch</div>
                <div className='text-gray-600 text-center mt-2'>Whether you have questions or you would just like to say hello, contact us.</div>
            </div>
            <div className='border-2 border-primary border-opacity-30 bg-white w-11/12 sm:w-fit -translate-y-1/4 lg:-translate-y-2/4 mx-auto flex flex-col lg:flex-row gap-4 rounded-xl p-3'>
                <div className='rounded-lg flex flex-col px-6 py-5 bg-primary bg-opacity-70 text-white'>
                    <div className='text-2xl font-semibold'>Contact Information</div>
                    <div className='flex-1 flex flex-col gap-3 mt-5'>
                        <div className='flex items-center gap-2 mt-4'>
                            <Image src={phoneIcon} alt="" />
                            +91 82507 11212
                        </div>
                        <div className='flex items-center gap-2 mt-4'>
                            <Image src={mailIcon} alt="" />
                            sayan825071das@gmail.com
                        </div>
                        <div className='flex items-center gap-2 mt-4'>
                            <Image src={locationIcon} alt="" width={30} height={30} />
                            Kadasole more, Bankura, <br />Pin.: 722202 - West Bengal
                        </div>
                    </div>
                </div>
                <div className='px-4 pt-4 pb-1 flex flex-col'>
                    <div className='flex flex-col md:flex-row gap-6'>
                        <div className='flex flex-col gap-0.5'>
                            <div className='text-sm'>Name</div>
                            <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className='outline-none border-2 rounded-md border-opacity-60 mt-1 border-primary text-xl font-semibold p-2' />
                        </div>
                        <div className='flex flex-col gap-0.5'>
                            <div className='text-sm'>Email / Phone</div>
                            <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className='outline-none border-2 rounded-md border-opacity-60 mt-1 border-primary text-xl font-semibold p-2' />
                        </div>
                    </div>
                    <div className='mt-8 flex flex-col gap-0.5'>
                        <div className='text-sm'>Subject</div>
                        <input value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className='outline-none border-2 rounded-md border-opacity-60 mt-1 border-primary text-xl font-semibold p-2' />
                    </div>
                    <div className='mt-8 flex flex-col gap-0.5'>
                        <div className='text-sm'>Messege</div>
                        <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className='outline-none border-2 rounded-md border-opacity-60 mt-1 border-primary text-lg font-semibold p-2' rows={3} ></textarea>
                    </div>
                    <button className='px-7 py-2 cursor-pointer rounded-md mt-4 mx-auto text-white bg-primary' onClick={sendData}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default ContactPage