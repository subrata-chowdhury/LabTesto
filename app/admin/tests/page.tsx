'use client'
import Card from '@/components/Card';
import Table from '@/components/Table';
import React, { useCallback, useEffect, useState } from 'react'
import plusIcon from '@/assets/plus.svg'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import fetcher from '@/lib/fetcher';
import trashBin from '@/assets/trash-bin.svg'

const Tests = () => {
    const [testData, setTestData] = useState<Test[]>([]);
    const [analytics, setAnalytics] = useState<{ pursuing: number, applied: number, graduated: number }>({ pursuing: 0, applied: 0, graduated: 0 });

    const [limit, setLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const [branch, setBranch] = useState('All');
    const [type, setType] = useState('All');

    const [name, setName] = useState('');

    const navigate = useRouter();

    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getAnalytics();
    }, [])

    const fetchTests = useCallback(async () => {
        const filterData: { department?: string, sampleType?: string, name?: string } = { department: branch, sampleType: type, name: name };
        if (branch === 'All') delete filterData.department;
        if (type === 'All') delete filterData.sampleType;
        if (name === '') delete filterData.name;

        const res = await fetcher.get<{ tests: Test[], pagination: { currentPage: number, pageSize: number, totalPages: number } }>(`/tests?filter=${JSON.stringify(filterData)}&limit=${limit}&page=${currentPage}`);
        if (res.status !== 200) return;
        if (res.body) {
            setTestData(res.body.tests);
            setTotalPages(res.body.pagination.totalPages || 1);
            setCurrentPage(res.body.pagination.currentPage);
            setLimit(res.body.pagination.pageSize);
        }
    }, [branch, type, name, currentPage, limit])

    useEffect(() => {
        fetchTests();
    }, [branch, type, name, currentPage, limit, fetchTests]);

    async function getAnalytics() {
        const res = await fetcher.get<{ pursuing: number, applied: number, graduated: number }>('/tests/analytics');
        if (res.status !== 200) return;
        if (res.body) {
            setAnalytics({
                pursuing: res.body.pursuing || 0,
                applied: res.body.applied || 0,
                graduated: res.body.graduated || 0
            });
        };
    }

    async function deleteTest(id: string) {
        const res = await fetcher.delete(`/tests/${id}`);
        if (res.status !== 200) return;
        await fetchTests();
    }

    return (
        <>
            <div className='flex flex-col'>
                <div className='mb-4 justify-start'>
                    <Card label='Total Tests' value={(analytics.applied + analytics.graduated + analytics.pursuing)} className='mr-3 mt-3' />
                    <Card label='Total Blood' value={analytics.pursuing} colors={{ lineColor: '#A72854', iconBgColor: '#FEE0EA' }} className='mr-3 mt-3' />
                    <Card label='Total Urine' value={analytics.graduated} colors={{ lineColor: '#A74726', iconBgColor: '#FEE1D7' }} className='mr-3 mt-3' />
                    <Card label='Total Stool' value={analytics.applied} colors={{ lineColor: '#A74726', iconBgColor: '#FEF3DD' }} className='mr-3 mt-3' />
                </div>
                <div className='ms-auto mb-4 flex gap-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer' onClick={() => navigate.push('/admin/tests/new')}>
                    <div>New Test</div>
                    <Image src={plusIcon} alt='' />
                </div>
                <Table<Test>
                    name='Tests'
                    table={{
                        config: [
                            { heading: 'Name', selector: 'name' },
                            { heading: 'Type', selector: 'sampleType' },
                            { heading: 'Created At', selector: 'createdAt' },
                            {
                                heading: 'Actions', component: ({ data }) => <div className='flex gap-1 items-center w-fit'>
                                    <button className='text-blue-500' onClick={() => navigate.push('/tests/' + data._id)}>View</button>|
                                    <button className='text-blue-500' onClick={() => navigate.push(`/admin/tests/edit/${data._id}`)} >Edit</button>|
                                    <button className='text-red-500' onClick={() => deleteTest(data._id as string)} ><Image src={trashBin} alt="" width={20} height={20} /></button>
                                </div>
                            }
                        ],
                        data: testData
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

export default Tests;


type Test = {
    name: string;
    sampleType: 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other body fluid';
    tubeType: 'Clot/Plain tube (red color cap)' | 'Fluoride/Sugar tube (gray color cap)' | 'EDTA tube (purple color cap)' | 'Citrate tube (blue color cap)';
    description: string;
    fastingRequired: string;
    overview: string;
    testResultInterpretation: string;
    riskAssesment: string;
    resultTime: string;
    createdAt: string;
    updatedAt: string;
    _id: string;
}