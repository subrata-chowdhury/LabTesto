'use client'
import fetcher from '@/lib/fetcher';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Loading from './loading';
import Input from '@/components/Inputs/Input';
import Dropdown from '@/components/Dropdown';
import { toast } from 'react-toastify';

function ContactEditPage() {
    const { id } = useParams<{ id: string }>();
    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getContactDetails(id);
    }, [id])

    async function getContactDetails(id: string) {
        setLoading(true);
        const res = await fetcher.get<Contact>(`/admin/contacts/${id}`);
        if (res.body && res.status === 200)
            setContact(res.body);
        setLoading(false);
    }

    async function onSave() {
        if (!contact) return;
        const res = await fetcher.put<{ status: 'Pending' | 'Resolved' }, Contact>(`/admin/contacts/${id}`, { status: contact.status });
        if (res.body && res.status === 201) {
            setContact(res.body);
            toast.success('Contact updated successfully');
        } else {
            toast.error(res.error || 'Error updating contact');
        }
    }

    if (loading) return <Loading />

    return (
        <div className='bg-white mt-4 p-8 px-10'>
            <div className='text-xl flex gap-3 items-center font-bold pb-6'>
                Contact Form
            </div>
            <div className='flex flex-col gap-4 text-sm'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4'>
                    <Input label='Name' labelClass='font-medium' value={contact?.name || ''} onChange={() => { }} />
                    <Input label='Email' labelClass='font-medium' value={contact?.email || ''} onChange={() => { }} />
                </div>
                <Input label='Subject' labelClass='font-medium' value={contact?.subject || ''} onChange={() => { }} />
                <div className='text-sm flex flex-col gap-1 pt-2'>
                    <label className='font-medium'>Messege</label>
                    <textarea className='border-2 dark:border-gray-400 bg-transparent rounded w-full h-20 p-2 outline-none' rows={5} defaultValue={contact?.message} readOnly></textarea>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4'>
                    <div className='text-sm flex flex-col gap-1 pt-2'>
                        <label className='font-medium'>Status</label>
                        <Dropdown
                            width={'100%'}
                            value={contact?.status || ''} options={['Pending', 'Resolved']}
                            onChange={(val) => {
                                if (contact) setContact({ ...contact, status: val.value as 'Pending' | 'Resolved' });
                            }} />
                    </div>
                </div>
                {contact?.user && <div className='text-sm flex flex-col gap-1 pt-2'>
                    <label className='font-medium'>User</label>
                    <div className='border-2 rounded px-3 py-2'>
                        <div>ID: {contact?.user._id}</div>
                        <div>Name: {contact?.user.name}</div>
                        <div>Email: {contact?.user.email}</div>
                    </div>
                </div>}
                <div className='p-5 px-0 ms-auto justify-end items-end flex gap-4'>
                    <div className='font-medium text-blue-500 h-10 flex justify-center items-center px-4 border-2 border-blue-400 rounded cursor-pointer' onClick={() => { }}>Cancel</div>
                    <div className='bg-blue-400 font-medium text-white h-10 flex justify-center items-center px-4 rounded cursor-pointer' onClick={async () => { await onSave(); }}>Save</div>
                </div>
            </div>
        </div>
    )
}

export default ContactEditPage

type Contact = {
    name: string;
    email: string;
    subject: string;
    message: string;
    user?: {
        name: string;
        email: string;
        _id: string;
    };
    status: 'Pending' | 'Resolved';
    resolvedAt?: string | null;
    resolvedBy?: {
        name: string;
        email: string;
    } | null;
    createdAt: string;
    updatedAt: string;
    _id: string;
}