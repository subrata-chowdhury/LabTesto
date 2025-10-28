'use client'
import Card from '@/components/Card';
import Table from '@/components/Table';
import React, { useCallback, useEffect, useState } from 'react'
import plusIcon from '@/assets/plus.svg'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import fetcher from '@/lib/fetcher';
import TrashBinIcon from '@/assets/reactIcon/TrashBin';

const Collectors = () => {
    const [collectorData, setCollectorData] = useState<Collector[]>([]);
    const [analytics, setAnalytics] = useState<{ total: number }>({ total: 0 });

    const [limit, setLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    // const [branch, setBranch] = useState('All');
    const [type, setType] = useState('All');

    const [name, setName] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useRouter();

    const [totalPages, setTotalPages] = useState(0);

    const fetchCollectors = useCallback(async () => {
        setLoading(true);
        const filterData: { sampleType?: string, name?: string } = { sampleType: type, name: name };
        // if (branch === 'All') delete filterData.department;
        if (type === 'All') delete filterData.sampleType;
        if (name === '') delete filterData.name;

        const res = await fetcher.get<{ collectors: Collector[], pagination: { totalCollectors: number, currentPage: number, pageSize: number, totalPages: number } }>(`/admin/collectors?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`);
        if (res.status !== 200) return;
        if (res.body) {
            setCollectorData(res.body.collectors);
            setTotalPages(res.body.pagination.totalPages || 1);
            setCurrentPage(res.body.pagination.currentPage);
            setLimit(res.body.pagination.pageSize);
            setAnalytics({ total: res.body.pagination.totalCollectors })
        }
        setLoading(false);
    }, [type, name, currentPage, limit])

    useEffect(() => {
        fetchCollectors();
    }, [type, name, currentPage, limit, fetchCollectors]);

    async function deleteCollector(id: string) {
        if (!window.confirm('Are you sure you want to delete this collector?')) return;
        const res = await fetcher.delete(`/admin/collectors/${id}`);
        if (res.status !== 200) return;
        await fetchCollectors();
    }

    return (
        <>
            <div className='flex flex-col'>
                <div className='mb-4 justify-start'>
                    <Card label='Total Collectors' value={analytics.total} className='mr-3 mt-3' />
                    {/* <Card label='Total Pursuing' value={analytics.pursuing} colors={{ lineColor: '#A72854', iconBgColor: '#FEE0EA' }} className='mr-3 mt-3' />
                    <Card label='Total Graduated' value={analytics.graduated} colors={{ lineColor: '#A74726', iconBgColor: '#FEE1D7' }} className='mr-3 mt-3' />
                    <Card label='Total Applied' value={analytics.applied} colors={{ lineColor: '#A74726', iconBgColor: '#FEF3DD' }} className='mr-3 mt-3' /> */}
                </div>
                <div className='ms-auto mb-4 flex gap-2 bg-primary dark:bg-white/15 text-white px-4 py-2 rounded cursor-pointer' onClick={() => navigate.push('/admin/collectors/new')}>
                    <div>New Collector</div>
                    <Image src={plusIcon} alt='' />
                </div>
                <Table<Collector>
                    name='Collectors'
                    loading={loading}
                    table={{
                        config: [
                            {
                                heading: 'Name', 
                                selector: 'name', 
                                component: ({ data }) => <div>
                                    <div className='text-sm'>{data.name}</div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>{data.email}</div>
                                </div>
                            },
                            { heading: 'Experience', selector: 'experience' },
                            { heading: 'Rating', selector: 'rating' },
                            { heading: 'Rated', selector: 'rated' },
                            {
                                heading: 'Actions', component: ({ data }) => <div className='flex gap-1 items-center w-fit'>
                                    <button className='text-blue-500 cursor-pointer' onClick={() => navigate.push('/collectors/' + data._id)}>View</button>|
                                    <button className='text-blue-500 cursor-pointer' onClick={() => navigate.push(`/admin/collectors/edit/${data._id}`)} >Edit</button>|
                                    <button className='text-[#ff5d76] cursor-pointer' onClick={() => deleteCollector(data._id as string)} ><TrashBinIcon /></button>
                                </div>
                            }
                        ],
                        data: collectorData
                    }}
                    pagination={{ currentPage, totalPages: totalPages, onPageChange: setCurrentPage }}
                    limit={{ limit, options: [5, 10, 15], onLimitChange: (val) => setLimit(val as number) }}
                    onSearch={(val) => setName(val)}
                    tag={{ tags: ['All', 'Today'], onTagChange: (tag) => { setType(tag) } }} />
                {/* dropdown={{ options: ['All', 'Blood', 'Urine', 'Semen', 'Stool', 'Sputum', 'Other body fluid'], value: branch || 'All', onChange: (value) => { setBranch(value as string) }, width: 100 }} /> */}
            </div>
        </>
    )
}

export default Collectors;


type Collector = {
    name: string;
    email: string;
    password: string;
    phone?: string;

    adhaar?: string;
    experience?: number;
    qualification?: {
        degree?: string;
        college?: string;
        year?: number;
    }[];
    createdAt: Date;
    rating: number;
    rated: number;
    _id: string;
}