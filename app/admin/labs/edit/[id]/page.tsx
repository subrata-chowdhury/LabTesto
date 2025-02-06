'use client'
import React, { useEffect } from 'react'
import LabForm, { LabDetails } from '../../components/LabForm'
import { useParams } from 'next/navigation'
import fetcher from '@/lib/fetcher'

const Page = () => {
    const [labDetails, setLabDetails] = React.useState<LabDetails>({
        name: '',
        location: { address: '', location: { lat: 0, lang: 0 } },
        prices: [],
        ranges: [],
    })

    const { id } = useParams();

    useEffect(() => {
        fetcher.get<FetchedLabDetails>(`/labs/${id}`).then((res) => {
            if (res.status === 200 && res.body) {
                const labDetails: LabDetails = {
                    name: res.body.name,
                    description: res.body.description,
                    location: res.body.location,
                    certification: res.body.certification,
                    prices: [],
                };
                labDetails.prices = res.body.prices.map(e => ({ test: e.test._id, name: e.test.name, offer: e.offer, price: e.price, expenses: e.expenses }))
                labDetails.packagesInclude = res.body.packagesInclude?.map(e => ({ test: e.test._id, name: e.test.name, packages: e.packages }))
                labDetails.ranges = res.body.ranges?.map(e => ({ test: e.test._id, name: e.test.name, ranges: e.ranges }))
                setLabDetails(labDetails);
            }
        })
    }, [id])

    async function saveLab() {
        const res = await fetcher.post<LabDetails, { messege: string }>(`/labs/${id}`, labDetails);
        if (res.status === 200) {
            alert('Lab saved successfully');
        } else {
            alert('Error saving lab');
        }
    }

    return (
        <>
            <LabForm
                labDetails={labDetails}
                error={null}
                onChange={{ labDetails: setLabDetails }}
                onSave={() => saveLab()}
            />
        </>
    )
}

type FetchedLabDetails = {
    name: string,
    description?: string,
    location: {
        address: string,
        location: {
            lat: number,
            lang: number
        }
    },
    certification?: {
        organization?: string,
        imageUrl?: string
    },
    prices: Price[],
    packagesInclude?: PackageInclude[],
    ranges?: Range[]
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