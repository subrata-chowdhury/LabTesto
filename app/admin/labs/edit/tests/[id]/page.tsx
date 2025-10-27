'use client'
import React, { useEffect, useState } from 'react'
import LabForm, { LabTestDetails } from '../../../components/LabForm'
import { useParams } from 'next/navigation'
import fetcher from '@/lib/fetcher'
import { toast } from 'react-toastify'
import { LabWithMissingPrices } from '@/app/admin/datamiss/page'

const Page = () => {
    const [labDetails, setLabDetails] = useState<LabTestDetails>({
        name: '',
        details: []
    })
    const [loading, setLoading] = useState(false);
    const [datamissByLab, setDatamissByLab] = useState<LabWithMissingPrices[]>([])

    const { id } = useParams();

    useEffect(() => {
        fetcher.get<LabTestDetails>(`/admin/labs/tests/${id}`).then((res) => {
            if (res.status === 200 && res.body) {
                const labDetails: LabTestDetails = {
                    details: res.body.details || [],
                    name: res.body.name || ''
                };
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
        const res = await fetcher.post<LabTestDetails, { messege: string }>(`/admin/labs/tests/${id}`, labDetails);
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
                    <div key={lab.lab._id} className="mb-6 p-4 border border-gray-300/50 rounded-lg bg-white mt-6">
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

export default Page