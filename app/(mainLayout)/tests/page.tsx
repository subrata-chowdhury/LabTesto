'use client'
import fetcher from '@/lib/fetcher';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react'
import Loading from './loading';
import debounce from '@/lib/debouncer';

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

    const onSeach = useCallback(debounce(async function (filter: { name: string, sampleType?: 'All' | 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other' | 'Other Body Fluid' }, limit: number) {
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
    }, 300), []);

    useEffect(() => {
        onSeach({ name: '' }, 6);
    }, [])

    return (
        <main id="main" className='p-5 pb-12 container max-w-7xl mx-auto w-full'>
            <h1 className='text-xl text-center sm:text-2xl md:text-3xl tracking-wide sm:text-left font-bold text-primary dark:text-white'>All Available Tests</h1>
            <div className='flex flex-col sm:flex-row gap-4 mt-4'>
                <div className={"px-4 py-2 flex gap-3 justify-between border-primary/20 border dark:border-white/30 bg-gray-500/5 rounded-full"}>
                    <input
                        className="flex-1 text-sm outline-none bg-transparent"
                        type="text"
                        value={filter.name}
                        placeholder='Search for tests'
                        onChange={async e => {
                            setFilter({ ...filter, name: e.target.value });
                            onSeach({ name: e.target.value }, limit)
                        }} />
                    <button type="submit" className={"relative right-0 top-0"}>
                        <svg className="h-4 w-4 fill-primary dark:fill-white" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px"
                            viewBox="0 0 56.966 56.966" xmlSpace="preserve" width="512px" height="512px">
                            <path d="M55.146,51.887L41.588,38.329c3.486-4.191,5.377-9.479,5.377-14.979C46.965,10.478,36.486,0,23.482,0
                                C10.479,0,0,10.478,0,23.482c0,13.004,10.479,23.482,23.482,23.482c5.5,0,10.788-1.891,14.979-5.377l13.558,13.558
                                c1.219,1.219,3.195,1.219,4.414,0C56.365,55.082,56.365,53.106,55.146,51.887z M23.482,41.965
                                c-10.214,0-18.482-8.268-18.482-18.482S13.268,5,23.482,5s18.482,8.268,18.482,18.482S33.696,41.965,23.482,41.965z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className='flex flex-wrap justify-center sm:justify-normal gap-3 mt-3.5 opacity-80'>
                {['All', 'Blood', 'Urine', 'Semen', 'Stool', 'Sputum', 'Other'].map((sampleType, index) => (
                    <button
                        key={index}
                        className={`px-3.5 py-1.5 rounded-lg cursor-pointer text-sm font-semibold ${filter.sampleType === sampleType ? 'bg-primary text-white dark:bg-white dark:text-black' : 'bg-primary/15 text-primary dark:bg-white/10 dark:text-white'}`}
                        onClick={async () => {
                            setFilter({ ...filter, sampleType });
                            await onSeach({ name: filter.name, sampleType: sampleType as 'All' | 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other' }, limit)
                        }}
                    >
                        {sampleType}
                    </button>
                ))}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
                {
                    tests.map(test => (
                        <Link href={'/tests/' + test._id} key={test._id} className="flex flex-col bg-white dark:bg-black dark:border-white/30 rounded-md shadow-md shadow-primary/5 border border-primary/15 dark:border text-primary p-4 min-w-52">
                            <h1 className="text-xl font-semibold mb-1.5 dark:text-white">{test.name}</h1>
                            <p className="text-xs font-semibold text-white mb-2.5 bg-primary dark:bg-white/25 px-4 py-1.5 w-fit rounded-full">{test.sampleType}</p>
                            <p className="text-sm mt-auto opacity-60 dark:text-white text-black">Fasting: {test.fastingRequired} | Tube Type: {test.tubeType}</p>
                        </Link>
                    ))
                }
            </div>
            {loading && <Loading />}
            {totalPages !== 1 && !loading && <div className='w-full flex justify-center mt-2'>
                <button
                    className='mt-2 px-5 py-2 rounded bg-primary dark:bg-white/30 cursor-pointer text-white font-medium'
                    onClick={async () => {
                        setLimit(prevLimit => prevLimit + 6);
                        await onSeach({ ...filter, sampleType: filter.sampleType as 'All' | 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other' | 'Other Body Fluid' }, limit + 6)
                    }}
                >
                    Load More
                </button>
            </div>}
        </main>
    )
}

export default Tests