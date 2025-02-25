'use client'
import React, { useEffect, useState } from 'react'
import LabForm, { LabTestDetails } from '../../../components/LabForm'
import { useParams } from 'next/navigation'
import fetcher from '@/lib/fetcher'
import { toast } from 'react-toastify'

const Page = () => {
    const [labDetails, setLabDetails] = useState<LabTestDetails>({
        prices: [],
        ranges: [],
        resultTimes: [],
    })
    const [loading, setLoading] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        fetcher.get<FetchedLabDetails>(`/labs/${id}`).then((res) => {
            if (res.status === 200 && res.body) {
                const labDetails: LabTestDetails = {
                    prices: [],
                };
                labDetails.prices = res.body.prices.map(e => ({ test: e.test._id, name: e.test.name, offer: e.offer, price: e.price, expenses: e.expenses }))
                labDetails.packagesInclude = res.body.packagesInclude?.map(e => ({ test: e.test._id, name: e.test.name, packages: e.packages }))
                labDetails.ranges = res.body.ranges?.map(e => ({ test: e.test._id, name: e.test.name, ranges: e.ranges }))
                labDetails.resultTimes = res.body.resultTimes?.map(e => ({ test: e.test._id, name: e.test.name, resultTime: e.resultTime }))
                setLabDetails(labDetails);
            }
        })
    }, [id])

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
                onSave={() => saveLab()}
            />
        </>
    )
}

type FetchedLabDetails = {
    resultTimes?: ResultTime[],
    prices: Price[],
    packagesInclude?: PackageInclude[],
    ranges?: Range[]
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