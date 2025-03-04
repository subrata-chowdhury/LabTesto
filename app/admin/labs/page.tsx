'use client'
import Card from '@/components/Card';
import Table from '@/components/Table';
import React, { useCallback, useEffect, useState } from 'react'
import plusIcon from '@/assets/plus.svg'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import fetcher from '@/lib/fetcher';
import trashBin from '@/assets/trash-bin.svg'

const Labs = () => {
    const [labData, setLabData] = useState<Lab[]>([]);
    const [analytics, setAnalytics] = useState<{ totalLabs: number }>({ totalLabs: 0 });

    const [limit, setLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const [location, setLocation] = useState('All');
    const [name, setName] = useState('');

    const navigate = useRouter();

    const [totalPages, setTotalPages] = useState(0);

    // useEffect(() => {
    //     getAnalytics();
    // }, [])

    const fetchLabs = useCallback(async () => {
        const filterData: { location?: string, name?: string } = { location: location, name: name };
        if (location === 'All') delete filterData.location;
        if (name === '') delete filterData.name;

        const res = await fetcher.get<{ labs: Lab[], pagination: { totalLabs: number, currentPage: number, pageSize: number, totalPages: number } }>(`/labs?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`);
        if (res.status !== 200) return;
        if (res.body) {
            setLabData(res.body.labs);
            setTotalPages(res.body.pagination.totalPages || 1);
            setCurrentPage(res.body.pagination.currentPage);
            setLimit(res.body.pagination.pageSize);
            setAnalytics({ totalLabs: res.body.pagination.totalLabs });
        }
    }, [location, name, currentPage, limit])

    useEffect(() => {
        fetchLabs();
    }, [location, name, currentPage, limit, fetchLabs]);

    // async function getAnalytics() {
    //     const res = await fetcher.get<{ totalLabs: number }>('/labs/analytics');
    //     if (res.status !== 200) return;
    //     if (res.body) {
    //         setAnalytics({
    //             totalLabs: res.body.totalLabs || 0
    //         });
    //     };
    // }

    async function deleteLab(id: string) {
        if(!window.confirm('Are you sure you want to delete this lab?')) return;
        const res = await fetcher.delete(`/admin/labs/${id}`);
        if (res.status !== 200) return;
        await fetchLabs();
    }

    return (
        <>
            <div className='flex flex-col'>
                <div className='mb-4 justify-start'>
                    <Card label='Total Labs' value={analytics.totalLabs} className='mr-3 mt-3' />
                </div>
                <div className='ms-auto mb-4 flex gap-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer' onClick={() => navigate.push('/admin/labs/new')}>
                    <div>New Lab</div>
                    <Image src={plusIcon} alt='' />
                </div>
                <Table<Lab>
                    name='Labs'
                    table={{
                        config: [
                            { heading: 'Name', selector: 'name' },
                            { heading: 'Location', selector: 'location', component: ({ data }) => <p>{data.location.address.pin}</p> },
                            { heading: 'Rating', selector: 'rating' },
                            { heading: 'Rated', selector: 'rated' },
                            {
                                heading: 'Actions', component: ({ data }) => <div className='flex gap-1 items-center w-fit'>
                                    <button className='text-blue-500' onClick={() => navigate.push(`/admin/labs/edit/tests/${data._id}`)} >Edit Tests</button>|
                                    <button className='text-blue-500' onClick={() => navigate.push('/admin/labs/edit/about/' + data._id)}>Edit About</button>|
                                    <button className='text-red-500' onClick={() => deleteLab(data._id as string)} ><Image src={trashBin} alt="" width={20} height={20} /></button>
                                </div>
                            }
                        ],
                        data: labData
                    }}
                    pagination={{ currentPage, totalPages: totalPages, onPageChange: setCurrentPage }}
                    limit={{ limit, options: [5, 10, 15], onLimitChange: (val) => setLimit(val as number) }}
                    onSearch={(val) => setName(val)}
                    tag={{ tags: ['All', 'Today'], onTagChange: (tag) => { setLocation(tag) } }} />
                    {/* dropdown={{ options: ['All', 'Location1', 'Location2', 'Location3'], value: location || 'All', onChange: (value) => { setLocation(value as string) }, width: 100 }} /> */}
            </div>
        </>
    )
}

export default Labs;

type Lab = {
    name: string,
    location: {
        address: {
            pin: string,
            city: string,
            district: string,
            other: string, // road details 
        },
        location: {
            lat: number,
            lang: number
        }
    },
    certification?: {
        organization: string,
        imageUrl?: string
    },
    prices: {
        name: number,
        price: number,
        offer?: number
    }[],
    packagesInclude?: {
        test: string,
        packages: string[]
    }[],
    ranges?: {
        test: string,
        ranges: object[]
    }[],
    createdAt: string,
    rating: number;
    rated: number;
    _id: string;
}