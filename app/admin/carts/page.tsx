'use client'
import Card from '@/components/Card';
import Table from '@/components/Table';
import React, { useCallback, useEffect, useState } from 'react'
// import plusIcon from '@/assets/plus.svg'
import Image from 'next/image';
// import { useRouter } from 'next/navigation';
import fetcher from '@/lib/fetcher';
import trashBin from '@/assets/trash-bin.svg'

const Carts = () => {
    const [cartData, setCartData] = useState<Cart[]>([]);
    const [analytics, setAnalytics] = useState<{ totalCarts: number }>({ totalCarts: 0 });

    const [limit, setLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const [branch, setBranch] = useState('All');
    const [type, setType] = useState('All');

    const [name, setName] = useState('');

    const [loading, setLoading] = useState(false);

    // const navigate = useRouter();

    const [totalPages, setTotalPages] = useState(0);

    const fetchCarts = useCallback(async () => {
        setLoading(true);
        const filterData: { department?: string, sampleType?: string, name?: string } = { department: branch, sampleType: type, name: name };
        if (branch === 'All') delete filterData.department;
        if (type === 'All') delete filterData.sampleType;
        if (name === '') delete filterData.name;

        const res = await fetcher.get<{ carts: Cart[], pagination: { totalCarts: number, currentPage: number, pageSize: number, totalPages: number } }>(`/admin/carts?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`);
        if (res.status !== 200) return;
        if (res.body) {
            setCartData(res.body.carts);
            setTotalPages(res.body.pagination.totalPages || 1);
            setCurrentPage(res.body.pagination.currentPage);
            setLimit(res.body.pagination.pageSize);
            setAnalytics({ totalCarts: res.body.pagination.totalCarts });
        }
        setLoading(false);
    }, [branch, type, name, currentPage, limit])

    useEffect(() => {
        fetchCarts();
    }, [branch, type, name, currentPage, limit, fetchCarts]);

    // async function getAnalytics() {
    //     const res = await fetcher.get<{ totalCarts: number }>('/carts/analytics');
    //     if (res.status !== 200) return;
    //     if (res.body) {
    //         setAnalytics({
    //             totalCarts: res.body.totalCarts || 0
    //         });
    //     };
    // }

    async function deleteCart(id: string) {
        const res = await fetcher.delete(`/admin/carts/${id}`);
        if (res.status !== 200) return;
        await fetchCarts();
    }

    return (
        <>
            <div className='flex flex-col'>
                <div className='mb-4 justify-start'>
                    <Card label='Total Carts' value={analytics.totalCarts} className='mr-3 mt-3' />
                    {/* <Card label='Total Pursuing' value={analytics.pursuing} colors={{ lineColor: '#A72854', iconBgColor: '#FEE0EA' }} className='mr-3 mt-3' />
                    <Card label='Total Graduated' value={analytics.graduated} colors={{ lineColor: '#A74726', iconBgColor: '#FEE1D7' }} className='mr-3 mt-3' />
                    <Card label='Total Applied' value={analytics.applied} colors={{ lineColor: '#A74726', iconBgColor: '#FEF3DD' }} className='mr-3 mt-3' /> */}
                </div>
                {/* <div className='ms-auto mb-4 flex gap-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer' onClick={() => navigate.push('/admin/carts/new')}>
                    <div>New Cart</div>
                    <Image src={plusIcon} alt='' />
                </div> */}
                <Table<Cart>
                    name='Carts'
                    loading={loading}
                    table={{
                        config: [
                            { heading: 'User ID', selector: 'user' },
                            {
                                heading: 'Items', selector: 'items', component: ({ data }) => {
                                    return <div>{data.items.length}</div>
                                }
                            },
                            { heading: 'Created At', selector: 'createdAt', component: ({ data }) => <div>{new Date(data.createdAt).toDateString()}</div> },
                            {
                                heading: 'Actions', component: ({ data }) => <div className='flex gap-1 items-center w-fit'>
                                    {/* <button className='text-blue-500' onClick={() => navigate.push('/carts/' + data._id)}>View</button>| */}
                                    {/* <button className='text-blue-500' onClick={() => navigate.push(`/admin/carts/edit/${data._id}`)} >Edit</button>| */}
                                    <button className='text-red-500' onClick={() => deleteCart(data._id as string)} ><Image src={trashBin} alt="" width={20} height={20} /></button>
                                </div>
                            }
                        ],
                        data: cartData
                    }}
                    pagination={{ currentPage, totalPages: totalPages, onPageChange: setCurrentPage }}
                    limit={{ limit, options: [5, 10, 15], onLimitChange: (val) => setLimit(val as number) }}
                    onSearch={(val) => setName(val)}
                    tag={{ tags: ['All', 'Today'], onTagChange: (tag) => { setType(tag) } }}
                    dropdown={{ options: ['All', 'Blood', 'Urine', 'Semen', 'Stool', 'Sputum', 'Other body fluid'], value: branch || 'All', onChange: (value) => { setBranch(value as string) }, width: 100 }} />
            </div>
        </>
    )
}

export default Carts;


type Cart = {
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
                other: string;
            };
        }[];
        quantity: number;
        date: Date;
    }[],
    user: string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}