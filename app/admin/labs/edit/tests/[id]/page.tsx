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
                    name: res.body.name || ''
                };

                labDetails.prices = res.body.prices ? Object.values(res.body.prices).map(e => ({ test: e.test._id, name: e.test.name, offer: e.offer, price: e.price, expenses: e.expenses })) : [];
                labDetails.packagesInclude = res.body.packagesInclude ? Object.values(res.body.packagesInclude).map(e => ({ test: e.test._id, name: e.test.name, packages: e.packages })) : [];
                labDetails.ranges = res.body.ranges ? Object.values(res.body.ranges).map(e => ({ test: e.test._id, name: e.test.name, ranges: e.ranges })) : [];
                labDetails.resultTimes = res.body.resultTimes ? Object.values(res.body.resultTimes).map(e => ({ test: e.test._id, name: e.test.name, resultTime: e.resultTime })) : [];
                setLabDetails(labDetails);
            }
        })
        fetchDatamissByLab(id);
    }, [id])

    async function fetchDatamissByLab(id?: string | string[]) {
        if (!id) return;
        if (Array.isArray(id)) id = id[0];
        fetcher.get<LabWithMissingPrices[]>('/admin/datamiss?labId=' + id).then((res) => {
            if (res.body) {
                setDatamissByLab(res.body);
            }
        })
    }

    async function saveLab() {
        setLoading(true);
        const newLabDetails: SaveLabDetails = {
            prices: {},
            resultTimes: {},
            packagesInclude: {},
            ranges: {}
        };
        if (labDetails.prices)
            for (let index = 0; index < (labDetails.prices || []).length; index++) {
                newLabDetails.prices[labDetails.prices[index].test] = {
                    test: labDetails.prices[index].test,
                    price: labDetails.prices[index].price,
                    offer: labDetails.prices[index].offer,
                    expenses: labDetails.prices[index].expenses
                };
            }
        if (labDetails.resultTimes)
            for (let index = 0; index < (labDetails.resultTimes || []).length; index++) {
                newLabDetails.resultTimes[labDetails.resultTimes[index].test] = {
                    test: labDetails.resultTimes[index].test,
                    resultTime: labDetails.resultTimes[index].resultTime
                };
            }
        if (labDetails.packagesInclude)
            for (let index = 0; index < (labDetails.packagesInclude || []).length; index++) {
                newLabDetails.packagesInclude[labDetails.packagesInclude[index].test] = {
                    test: labDetails.packagesInclude[index].test,
                    packages: labDetails.packagesInclude[index].packages
                };
            }
        if (labDetails.ranges)
            for (let index = 0; index < (labDetails.ranges || []).length; index++) {
                newLabDetails.ranges[labDetails.ranges[index].test] = {
                    test: labDetails.ranges[index].test,
                    ranges: labDetails.ranges[index].ranges
                };
            }
        const res = await fetcher.post<SaveLabDetails, { messege: string }>(`/admin/labs/${id}`, newLabDetails);
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
                    await fetchDatamissByLab(id);
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
    resultTimes?: { [key: string]: ResultTime },
    prices?: { [key: string]: Price },
    packagesInclude?: { [key: string]: PackageInclude },
    ranges?: { [key: string]: Range },
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


type SaveLabDetails = {
    resultTimes: { [key: string]: SaveResultTime },
    prices: { [key: string]: SavePrice },
    packagesInclude: { [key: string]: SavePackageInclude },
    ranges: { [key: string]: SaveRange }
}

type SaveResultTime = {
    name?: string,
    test: string,
    resultTime: string,
}

type SavePrice = {
    name?: string,
    test: string,
    price: number,
    offer: number,
    expenses: number
}

type SavePackageInclude = {
    name?: string,
    test: string,
    packages: string[]
}

type SaveRange = {
    name?: string,
    test: string,
    ranges: { [key: string]: string }[]
}

export default Page