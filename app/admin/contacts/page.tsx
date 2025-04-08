'use client'
import Card from '@/components/Card';
import Table from '@/components/Table';
import React, { useCallback, useEffect, useState } from 'react'
import plusIcon from '@/assets/plus.svg'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import fetcher from '@/lib/fetcher';
import TrashBinIcon from '@/assets/reactIcon/TrashBin';
import { toast } from 'react-toastify';

const Orders = () => {
    const [testData, setOrderData] = useState<Contact[]>([]);
    const [analytics, setAnalytics] = useState<{ totalContacts: number, resolved: number }>({ totalContacts: 0, resolved: 0 });

    const [limit, setLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const [branch, setBranch] = useState('All');
    const [type, setType] = useState('All');

    const [name, setName] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useRouter();

    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getAnalytics();
    }, [])

    const fetchContacts = useCallback(async () => {
        setLoading(true);
        const filterData: { status?: string, date?: string, name?: string } = { status: branch, date: type, name: name };
        if (branch === 'All') delete filterData.status;
        if (type === 'All') delete filterData.date;
        if (type === 'Today') filterData.date = new Date().toISOString();
        if (name === '') delete filterData.name;

        const res = await fetcher.get<{ contacts: Contact[], pagination: { currentPage: number, pageSize: number, totalPages: number } }>(`/admin/contacts?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`);
        if (res.status !== 200) return;
        if (res.body) {
            setOrderData(res.body.contacts);
            setTotalPages(res.body.pagination.totalPages || 1);
            setCurrentPage(res.body.pagination.currentPage);
            setLimit(res.body.pagination.pageSize);
        }
        setLoading(false);
    }, [branch, type, name, currentPage, limit])

    useEffect(() => {
        fetchContacts();
    }, [branch, type, name, currentPage, limit, fetchContacts]);

    async function getAnalytics() {
        const res = await fetcher.get<{ totalContacts: number, resolved: number }>('/admin/contacts/analytics');
        if (res.status !== 200) return;
        if (res.body) {
            setAnalytics(res.body);
        };
    }

    async function deleteContact(id: string) {
        if (!window.confirm('Are you sure you want to delete this contact details?')) return;
        const res = await fetcher.delete(`/admin/contacts/${id}`);
        if (res.status !== 200) return;
        if (res.status === 200 && res.body) {
            toast.success('Contact deleted successfully!');
        }
        await fetchContacts();
    }

    return (
        <>
            <div className='flex flex-col'>
                <div className='mb-4 justify-start'>
                    <Card label='Total Contacts' value={analytics.totalContacts} className='mr-3 mt-3' />
                    <Card label='Total Resolved' value={analytics.resolved} colors={{ lineColor: '#A72854', iconBgColor: '#FEE0EA' }} className='mr-3 mt-3' />
                    {/* <Card label='Total Ordered' value={analytics.ordered} colors={{ lineColor: '#A74726', iconBgColor: '#FEE1D7' }} className='mr-3 mt-3' />
                    <Card label='Total Collected' value={analytics.sampleCollected} colors={{ lineColor: '#A74726', iconBgColor: '#FEF3DD' }} className='mr-3 mt-3' /> */}
                </div>
                <Table<Contact>
                    name='Contacts'
                    loading={loading}
                    table={{
                        config: [
                            {
                                heading: 'User',
                                selector: 'user',
                                component: ({ data }) => <div>
                                    <div className='text-sm'>{data.name}</div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>{data.email}</div>
                                </div>
                            },
                            {
                                heading: 'Resolved By',
                                selector: 'resolvedBy',
                                component: ({ data }) => <div>
                                    <div className='text-sm'>{data.resolvedBy?.name || 'Not Assigned'}</div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>{data.resolvedBy?.email}</div>
                                </div>
                            },
                            { heading: 'Status', selector: 'status', component: ({ data }) => <ColoredStatus data={data} /> },
                            {
                                heading: 'Actions', component: ({ data }) => <div className='flex gap-1 items-center w-fit'>
                                    <button className='text-blue-500' onClick={() => navigate.push('/admin/contacts/view/' + data._id)}>View</button>|
                                    <button className='text-blue-500' onClick={() => navigate.push(`/admin/contacts/edit/${data._id}`)} >Edit</button>|
                                    <button className='text-[#ff5d76]' onClick={() => deleteContact(data._id)} ><TrashBinIcon /></button>
                                </div>
                            }
                        ],
                        data: testData
                    }}
                    pagination={{ currentPage, totalPages: totalPages, onPageChange: setCurrentPage }}
                    limit={{ limit, options: [5, 10, 15], onLimitChange: (val) => setLimit(val as number) }}
                    onSearch={(val) => setName(val)}
                    tag={{ tags: ['All', 'Today'], onTagChange: (tag) => { setType(tag) } }}
                    dropdown={{ options: ['All', 'pending', 'resolved'], value: branch || 'All', onChange: (value) => { setBranch(value as string) }, width: 100 }} />
            </div>
        </>
    )
}

export default Orders;

function ColoredStatus({ data }: { data: Contact }) {
    if (data.status === 'Resolved') return <div className='text-green-500'>{data.status}</div>
    if (data.status === 'Pending') return <div className='text-red-500'>{data.status}</div>
}


type Contact = {
    name: string;
    email: string;
    subject: string;
    message: string;
    user?: {
        name: string;
        email: string;
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