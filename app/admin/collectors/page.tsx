'use client'
import Card from '@/components/Card';
import Table from '@/components/Table';
import React, { useCallback, useEffect, useState } from 'react'
import plusIcon from '@/assets/plus.svg'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import fetcher from '@/lib/fetcher';
import trashBin from '@/assets/trash-bin.svg'

const Collectors = () => {
    const [collectorData, setCollectorData] = useState<Collector[]>([]);
    const [analytics, setAnalytics] = useState<{ total: number }>({ total: 0 });

    const [limit, setLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const [branch, setBranch] = useState('All');
    const [type, setType] = useState('All');

    const [name, setName] = useState('');

    const navigate = useRouter();

    const [totalPages, setTotalPages] = useState(0);

    const fetchCollectors = useCallback(async () => {
        const filterData: { department?: string, sampleType?: string, name?: string } = { department: branch, sampleType: type, name: name };
        if (branch === 'All') delete filterData.department;
        if (type === 'All') delete filterData.sampleType;
        if (name === '') delete filterData.name;

        const res = await fetcher.get<{ collectors: Collector[], pagination: { totalCollectors: number, currentPage: number, pageSize: number, totalPages: number } }>(`/collectors?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`);
        if (res.status !== 200) return;
        if (res.body) {
            setCollectorData(res.body.collectors);
            setTotalPages(res.body.pagination.totalPages || 1);
            setCurrentPage(res.body.pagination.currentPage);
            setLimit(res.body.pagination.pageSize);
            setAnalytics({ total: res.body.pagination.totalCollectors })
        }
    }, [branch, type, name, currentPage, limit])

    useEffect(() => {
        fetchCollectors();
    }, [branch, type, name, currentPage, limit, fetchCollectors]);

    async function deleteCollector(id: string) {
        const res = await fetcher.delete(`/collectors/${id}`);
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
                <div className='ms-auto mb-4 flex gap-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer' onClick={() => navigate.push('/admin/collectors/new')}>
                    <div>New Collector</div>
                    <Image src={plusIcon} alt='' />
                </div>
                <Table<Collector>
                    name='Collectors'
                    table={{
                        config: [
                            { heading: 'Name', selector: 'name' },
                            { heading: 'Experience', selector: 'experience' },
                            { heading: 'Joined At', selector: 'createdAt' },
                            {
                                heading: 'Actions', component: ({ data }) => <div className='flex gap-1 items-center w-fit'>
                                    <button className='text-blue-500' onClick={() => navigate.push('/collectors/' + data._id)}>View</button>|
                                    <button className='text-blue-500' onClick={() => navigate.push(`/admin/collectors/edit/${data._id}`)} >Edit</button>|
                                    <button className='text-red-500' onClick={() => deleteCollector(data._id as string)} ><Image src={trashBin} alt="" width={20} height={20} /></button>
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
    _id: string;
}