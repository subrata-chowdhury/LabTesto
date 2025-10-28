'use client'
import fetcher from '@/lib/fetcher'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

function Page() {
    const [datamissByLab, setDatamissByLab] = useState<LabWithMissingPrices[]>([])
    const [loading, setLoading] = useState(false)
    const limit = useRef(10);
    const prevLabs = useRef<number>(0);

    useEffect(() => {
        fetchDatamissByLab(10)
    }, [])

    const fetchDatamissByLab = async (limit: number) => {
        setLoading(true)
        const res = await fetcher.get<LabWithMissingPrices[]>('/admin/datamiss?limit=' + limit);
        if (res.body) {
            setDatamissByLab(res.body);
        }
        setLoading(false)
    }

    return (
        <div className="p-4 flex flex-col">
            {
                datamissByLab.map((lab) => (
                    <Link href={'/admin/labs/edit/tests/' + lab.lab._id} key={lab.lab._id}>
                        <div className="mb-6 p-4 border border-gray-300/50 rounded-lg shadow-md bg-white dark:bg-black">
                            <h2 className="text-xl font-semibold mb-2">{lab.lab.name}</h2>
                            <ul className="list-disc list-inside">
                                {lab.missingTests.map((missingTest) => (
                                    <li key={missingTest.test._id} className="ml-4">{missingTest.testName}</li>
                                ))}
                            </ul>
                        </div>
                    </Link>
                ))
            }
            {(datamissByLab.length > 0 && prevLabs.current !== datamissByLab.length) &&
                <button
                    onClick={async () => {
                        prevLabs.current = datamissByLab.length;
                        await fetchDatamissByLab(limit.current + 10);
                    }}
                    disabled={loading}
                    className="mt-2 mx-auto px-4 py-2 bg-primary dark:bg-white/25 cursor-pointer text-white rounded-sm"
                >
                    {loading ? "Loading..." : "Load More"}
                </button>
            }
        </div>
    )
}
export type LabWithMissingPrices = {
    lab: {
        _id: string;
        name: string;
        prices: {
            test: {
                _id: string;
            };
        }[];
    };
    missingTests: {
        test: {
            _id: string;
            name: string;
        };
        testName: string;
    }[];
};

export default Page