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

    async function sendData(e: React.MouseEvent<HTMLButtonElement>) {
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
        <form className='px-4 pt-4 pb-1 flex flex-col' onSubmit={e => e.preventDefault()}>
            <div className='flex flex-col md:flex-row gap-6'>
                <div className='flex flex-col gap-0.5'>
                    <label htmlFor='name' className='text-sm'>Name</label>
                    <input id='name' name='name' value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className='outline-none border-2 rounded-md border-opacity-60 mt-1 border-primary text-xl font-semibold p-2' />
                </div>
                <div className='flex flex-col gap-0.5'>
                    <label htmlFor='email' className='text-sm'>Email / Phone</label>
                    <input id='email' name='email' value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className='outline-none border-2 rounded-md border-opacity-60 mt-1 border-primary text-xl font-semibold p-2' />
                </div>
            </div>
            <div className='mt-8 flex flex-col gap-0.5'>
                <label htmlFor='subject' className='text-sm'>Subject</label>
                <input id='subject' name='subject' value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className='outline-none border-2 rounded-md border-opacity-60 mt-1 border-primary text-xl font-semibold p-2' />
            </div>
            <div className='mt-8 flex flex-col gap-0.5'>
                <label htmlFor='message' className='text-sm'>Message</label>
                <textarea id='message' name='message' value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className='outline-none border-2 rounded-md border-opacity-60 mt-1 border-primary text-lg font-semibold p-2' rows={3} ></textarea>
            </div>
            <button type='submit' disabled={loading} className='px-7 py-2 cursor-pointer rounded-md mt-4 mx-auto text-white bg-primary' onClick={sendData}>{loading ? 'Submitting..' : 'Submit'}</button>
        </form>
    )
}