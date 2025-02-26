'use client'
import React, { useEffect, useState } from 'react'
import LabForm, { LabTestDetails } from '../../../components/LabForm'
import { useParams } from 'next/navigation'
import fetcher from '@/lib/fetcher'
import { toast } from 'react-toastify'
import { LabWithMissingPrices } from '@/app/admin/warnings/page'

const Page = () => {
    const [labDetails, setLabDetails] = useState<LabTestDetails>({
        name: '',
        prices: [],
        ranges: [],
        resultTimes: [],
    })
    const [loading, setLoading] = useState(false);
    const [datamissByLab, setDatamissByLab] = useState<LabWithMissingPrices[]>([])

    const { id } = useParams();

    useEffect(() => {
        fetcher.get<FetchedLabDetails>(`/labs/${id}`).then((res) => {
            if (res.status === 200 && res.body) {
                const labDetails: LabTestDetails = {
                    prices: [],
                    name: res.body.name
                };
                labDetails.prices = res.body.prices.map(e => ({ test: e.test._id, name: e.test.name, offer: e.offer, price: e.price, expenses: e.expenses }))
                labDetails.packagesInclude = res.body.packagesInclude?.map(e => ({ test: e.test._id, name: e.test.name, packages: e.packages }))
                labDetails.ranges = res.body.ranges?.map(e => ({ test: e.test._id, name: e.test.name, ranges: e.ranges }))
                labDetails.resultTimes = res.body.resultTimes?.map(e => ({ test: e.test._id, name: e.test.name, resultTime: e.resultTime }))
                setLabDetails(labDetails);
            }
        })
    }, [id])

    async function fetchDatamissByLab() {
        fetcher.get<LabWithMissingPrices[]>('/admin/datamiss?labId=' + id).then((res) => {
            if (res.body) {
                setDatamissByLab(res.body);
            }
        })
    }

    async function saveLab() {
        setLoading(true);
        const res = await fetcher.post<LabTestDetails, { messege: string }>(`/labs/${id}`, labDetails);
        if (res.status === 200) {
            toast.success('Lab saved successfully');
        } else {
            toast.error(res.error || 'Error saving lab');
        }
        setLoading(false);
    }

    return (
        <>
            <LabForm
                labDetails={labDetails}
                loading={loading}
                error={null}
                onChange={{ labDetails: setLabDetails }}
                onSave={async () => {
                    await saveLab();
                    await fetchDatamissByLab()
                }}
            />
            {
                datamissByLab.map((lab) => (
                    <div key={lab.lab._id} className="mb-6 p-4 border rounded-lg bg-white mt-6">
                        <div className='text-xl font-semibold mb-2'>Remaining Tests to Add</div>
                        {/* <h2 className="text-xl font-semibold mb-2">{lab.lab.name}</h2> */}
                        <ul className="list-disc list-inside">
                            {lab.missingTests.map((missingTest) => (
                                <li key={missingTest.test._id} className="ml-4">{missingTest.testName}</li>
                            ))}
                        </ul>
                    </div>
                ))
            }
        </>
    )
}

type FetchedLabDetails = {
    resultTimes?: ResultTime[],
    prices: Price[],
    packagesInclude?: PackageInclude[],
    ranges?: Range[],
    name?: string
}

type ResultTime = {
    name?: string,
    test: { _id: string, name: string },
    resultTime: string,
}

type Price = {
    name?: string,
    test: { _id: string, name: string },
    price: number,
    offer: number,
    expenses: number
}

type PackageInclude = {
    name?: string,
    test: { _id: string, name: string },
    packages: string[]
}

type Range = {
    name?: string,
    test: { _id: string, name: string },
    ranges: { [key: string]: string }[]
}

export default Page