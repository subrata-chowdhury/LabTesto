'use client'
import Dropdown from '@/components/Dropdown';
import fetcher from '@/lib/fetcher';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Loading from './loading';

type Test = {
    _id: string;
    name: string,
    otherTerms?: string[],
    sampleType: string,
    tubeType: string,
    description: string,
    fastingRequired: string,
    overview: string,
    testResultInterpretation: string,
    riskAssesment: string,
    resultTime: string
}

const Tests = () => {
    const [tests, setTests] = useState<Test[]>([]);
    // const [testSearch, setTestSearch] = useState<string>('');
    const [filter, setFilter] = useState({
        name: '',
        sampleType: 'All',
    })
    const [limit, setLimit] = useState(6);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    
    async function onSeach(filter: { name: string, sampleType?: 'All' | 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other' | 'Other Body Fluid' }, limit: number) {
        setLoading(true)
        if (filter?.sampleType === 'All') {
            delete filter.sampleType;
        }
        if (filter?.sampleType === 'Other') {
            filter.sampleType = 'Other Body Fluid'
        }
        const res = await fetcher.get<{ tests: Test[], pagination: { totalTests: number, currentPage: number, pageSize: number, totalPages: number } }>(`/tests?filter=${JSON.stringify(filter)}&limit=${limit || 6}&page=1`);
        if (res.status === 200 && res.body) {
            setTests(res.body.tests)
            setTotalPages(res.body.pagination.totalPages);
        }
        setLoading(false)
    }

    useEffect(() => {
        onSeach({ name: '' }, 6);
    }, [])

    return (
        <div className='p-5'>
            <h1 className='text-xl font-medium'>Tests</h1>
            <div className='flex flex-col sm:flex-row gap-4 mt-4'>
                <div className={"px-4 py-2 flex gap-3 justify-between border-primary border-opacity-50 border-2 rounded-full"}>
                    <input
                        className="flex-1 outline-none"
                        type="text"
                        value={filter.name}
                        placeholder='Search for tests'
                        onChange={async e => {
                            setFilter({ ...filter, name: e.target.value });
                            onSeach({ name: e.target.value }, limit)
                        }} />
                    <button type="submit" className={"relative right-0 top-0"}>
                        <svg className="h-4 w-4 fill-primary" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px"
                            viewBox="0 0 56.966 56.966" xmlSpace="preserve" width="512px" height="512px">
                            <path d="M55.146,51.887L41.588,38.329c3.486-4.191,5.377-9.479,5.377-14.979C46.965,10.478,36.486,0,23.482,0
                                C10.479,0,0,10.478,0,23.482c0,13.004,10.479,23.482,23.482,23.482c5.5,0,10.788-1.891,14.979-5.377l13.558,13.558
                                c1.219,1.219,3.195,1.219,4.414,0C56.365,55.082,56.365,53.106,55.146,51.887z M23.482,41.965
                                c-10.214,0-18.482-8.268-18.482-18.482S13.268,5,23.482,5s18.482,8.268,18.482,18.482S33.696,41.965,23.482,41.965z"/>
                        </svg>
                    </button>
                </div>
                <Dropdown
                    options={['All', 'Blood', 'Urine', 'Semen', 'Stool', 'Sputum', 'Other']}
                    value={filter.sampleType}
                    onChange={async (val) => {
                        setFilter({
                            ...filter,
                            sampleType: val.value as 'All' | 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other'
                        })
                        await onSeach({ name: filter.name, sampleType: val.value as 'All' | 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other' }, limit)
                    }}
                    width={85} />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-5'>
                {
                    tests.map(test => (
                        <div key={test._id} className='flex flex-col border-2 border-primary border-opacity-60 rounded-lg px-3 py-2'>
                            <div className='text-lg font-semibold'>{test.name}</div>
                            <div className='text-gray-600'><span className='text-black font-medium'>Type:</span> {test.sampleType}</div>
                            <div className='text-gray-600'><span className='text-black font-medium'>Tube:</span> {test.tubeType}</div>
                            <Link href={'/tests/' + test._id} className='px-4 py-2 mt-auto mb-1 ms-auto bg-primary rounded-md text-white w-fit'>View</Link>
                        </div>
                    ))
                }
            </div>
            {loading && <Loading />}
            {totalPages !== 1 && !loading && <div className='w-full flex justify-center mt-2'>
                <button
                    className='mt-2 px-5 py-2 rounded-md bg-primary text-white font-medium'
                    onClick={async () => {
                        setLimit(prevLimit => prevLimit + 6);
                        await onSeach({ ...filter, sampleType: filter.sampleType as 'All' | 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other' | 'Other Body Fluid' }, limit + 6)
                    }}
                >
                    Load More
                </button>
            </div>}
        </div>
    )
}

export default Tests