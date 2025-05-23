'use client'
import Card from '@/components/Card';
import Table from '@/components/Table';
import React, { useCallback, useEffect, useState } from 'react'
import plusIcon from '@/assets/plus.svg'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import fetcher from '@/lib/fetcher';
import TrashBinIcon from '@/assets/reactIcon/TrashBin';

const Orders = () => {
    const [testData, setOrderData] = useState<Order[]>([]);
    const [analytics, setAnalytics] = useState<{ totalOrders: number, canceled: number, ordered: number, sampleCollected: number }>({ totalOrders: 0, canceled: 0, ordered: 0, sampleCollected: 0 });

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

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const filterData: { status?: string, date?: string, name?: string } = { status: branch, date: type, name: name };
        if (branch === 'All') delete filterData.status;
        if (type === 'All') delete filterData.date;
        if (type === 'Today') filterData.date = new Date().toISOString();
        if (name === '') delete filterData.name;

        const res = await fetcher.get<{ orders: Order[], pagination: { currentPage: number, pageSize: number, totalPages: number } }>(`/admin/orders?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`);
        if (res.status !== 200) return;
        if (res.body) {
            setOrderData(res.body.orders);
            setTotalPages(res.body.pagination.totalPages || 1);
            setCurrentPage(res.body.pagination.currentPage);
            setLimit(res.body.pagination.pageSize);
        }
        setLoading(false);
    }, [branch, type, name, currentPage, limit])

    useEffect(() => {
        fetchOrders();
    }, [branch, type, name, currentPage, limit, fetchOrders]);

    async function getAnalytics() {
        const res = await fetcher.get<{ totalOrders: number, canceled: number, ordered: number, sampleCollected: number }>('/admin/orders/analytics');
        if (res.status !== 200) return;
        if (res.body) {
            setAnalytics({
                totalOrders: res.body.totalOrders || 0,
                canceled: res.body.canceled || 0,
                ordered: res.body.ordered || 0,
                sampleCollected: res.body.sampleCollected || 0
            });
        };
    }

    async function deleteOrder(id: string) {
        if (!window.confirm('Are you sure you want to delete this order?')) return;
        const res = await fetcher.delete(`/admin/orders/${id}`);
        if (res.status !== 200) return;
        await fetchOrders();
    }

    return (
        <>
            <div className='flex flex-col'>
                <div className='mb-4 justify-start'>
                    <Card label='Total Orders' value={analytics.totalOrders} className='mr-3 mt-3' />
                    <Card label='Total Canceled' value={analytics.canceled} colors={{ lineColor: '#A72854', iconBgColor: '#FEE0EA' }} className='mr-3 mt-3' />
                    <Card label='Total Ordered' value={analytics.ordered} colors={{ lineColor: '#A74726', iconBgColor: '#FEE1D7' }} className='mr-3 mt-3' />
                    <Card label='Total Collected' value={analytics.sampleCollected} colors={{ lineColor: '#A74726', iconBgColor: '#FEF3DD' }} className='mr-3 mt-3' />
                </div>
                <div className='ms-auto mb-4 flex gap-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer' onClick={() => navigate.push('/admin/orders/new')}>
                    <div>New Order</div>
                    <Image src={plusIcon} alt='' />
                </div>
                <Table<Order>
                    name='Orders'
                    loading={loading}
                    table={{
                        config: [
                            {
                                heading: 'User',
                                selector: 'user',
                                component: ({ data }) => <div>
                                    <div className='text-sm'>{data.user.name}</div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>{data.user.email}</div>
                                </div>
                            },
                            {
                                heading: 'Collector',
                                selector: 'collector',
                                component: ({ data }) => <div>
                                    <div className='text-sm'>{data.collector?.name || 'Not Assigned'}</div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>{data.collector?.email}</div>
                                </div>
                            },
                            { heading: 'Status', selector: 'status', component: ({ data }) => <ColoredStatus data={data} /> },
                            {
                                heading: 'Actions', component: ({ data }) => <div className='flex gap-1 items-center w-fit'>
                                    <button className='text-blue-500' onClick={() => navigate.push('/admin/orders/view/' + data._id)}>View</button>|
                                    <button className='text-blue-500' onClick={() => navigate.push(`/admin/orders/edit/${data._id}`)} >Edit</button>|
                                    <button className='text-[#ff5d76]' onClick={() => deleteOrder(data._id as string)} ><TrashBinIcon /></button>
                                </div>
                            }
                        ],
                        data: testData
                    }}
                    pagination={{ currentPage, totalPages: totalPages, onPageChange: setCurrentPage }}
                    limit={{ limit, options: [5, 10, 15], onLimitChange: (val) => setLimit(val as number) }}
                    onSearch={(val) => setName(val)}
                    tag={{ tags: ['All', 'Today'], onTagChange: (tag) => { setType(tag) } }}
                    dropdown={{ options: ['All', 'Ordered', 'Out for Sample Collection', 'Sample Collected', 'Report Delivered to Lab', 'Report Generated', 'Out for Report Delivery', 'Report Delivered', 'Canceled'], value: branch || 'All', onChange: (value) => { setBranch(value as string) }, width: 100 }} />
            </div>
        </>
    )
}

export default Orders;

function ColoredStatus({ data }: { data: Order }) {
    if (data.status === 'Ordered') return <div className='text-blue-500'>{data.status}</div>
    if (data.status === 'Out for Sample Collection') return <div className='text-purple-500'>{data.status}</div>
    if (data.status === 'Sample Collected') return <div className='text-yellow-500'>{data.status}</div>
    if (data.status === 'Report Delivered to Lab') return <div className='text-orange-500'>{data.status}</div>
    if (data.status === 'Report Generated') return <div className='text-green-500'>{data.status}</div>
    if (data.status === 'Out for Report Delivery') return <div className='text-teal-500'>{data.status}</div>
    if (data.status === 'Report Delivered') return <div className='text-green-500'>{data.status}</div>
    if (data.status === 'Canceled') return <div className='text-red-500'>{data.status}</div>
}


type Order = {
    items: {
        product: {
            test: string;
            lab: string;
            price: number;
        };
        patientDetails: {
            name: string;
            phone: string;
            address: {
                pin: number;
                city: string;
                district: string;
                other?: string; // road details
            };
        }[];
        quantity: number;
        date?: Date;
    }[];
    user: {
        _id: string;
        name: string;
        email: string;
    };
    collector?: {
        _id: string;
        name: string;
        email: string;
    };
    status: 'Ordered' | 'Out for Sample Collection' | 'Sample Collected' | 'Report Delivered to Lab' | 'Report Generated' | 'Out for Report Delivery' | 'Report Delivered' | 'Canceled';
    sampleTakenDateTime: {
        start?: Date;
        end?: Date;
    };
    reportDeliverTime: {
        start?: Date;
        end?: Date;
    };
    _id: string;
}