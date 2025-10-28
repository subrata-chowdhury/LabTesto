'use client'
import React, { useState } from 'react'
import fetcher from '@/lib/fetcher'
import { toast } from 'react-toastify'

export default function MainForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [loading, setLoading] = useState(false);

    async function sendData(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error('Please fill in all fields.');
            return;
        }

        setLoading(true);
        const res = await fetcher.post('/contact', formData);
        if (res.status === 200) {
            toast.success('Your message has been sent successfully.');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        }
        setLoading(false);
    }

    return (
        <form className='p-6 px-8 flex flex-col rounded-md border-2 border-primary/10 mb-6 lg:mb-24 bg-white dark:bg-black ' onSubmit={sendData}>
            <h2 className='text-2xl mb-4 font-bold text-primary dark:text-white'>Send Us a Message</h2>
            <div className='flex flex-col md:flex-row gap-6'>
                <div className='flex flex-col gap-0.5'>
                    <label htmlFor='name' className='text-sm'>Name *</label>
                    <input id='name' name='name' placeholder='Your Full Name' value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className='outline-none border border-gray-400/80 rounded-xs border-opacity-60 mt-1 bg-transparent text-sm p-2 px-3' />
                </div>
                <div className='flex flex-col gap-0.5'>
                    <label htmlFor='email' className='text-sm'>Email / Phone *</label>
                    <input id='email' name='email' placeholder='Your Email or Phone' value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className='outline-none border border-gray-400/80 rounded-xs border-opacity-60 mt-1 bg-transparent text-sm p-2 px-3' />
                </div>
            </div>
            <div className='mt-8 flex flex-col gap-0.5'>
                <label htmlFor='subject' className='text-sm'>Subject *</label>
                <input id='subject' name='subject' value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className='outline-none border border-gray-400/80 rounded-xs border-opacity-60 mt-1 bg-transparent text-sm p-2 px-3' />
            </div>
            <div className='mt-8 flex flex-col gap-0.5'>
                <label htmlFor='message' className='text-sm'>Message *</label>
                <textarea id='message' name='message' value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className='outline-none border border-gray-400/80 rounded-xs border-opacity-60 mt-1 bg-transparent text-sm p-2 px-3' rows={3} ></textarea>
            </div>
            <button type='submit' disabled={loading} className='px-7 py-2 cursor-pointer rounded-xs mt-4 mx-auto text-white bg-primary'>{loading ? 'Sending..' : 'Send Message'}</button>
        </form>
    )
}