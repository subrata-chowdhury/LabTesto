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
        fetcher.get<LabDetails>(`/labs/${id}`).then((res) => {
            if (res.status === 200 && res.body) {
                setLabDetails(res.body);
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

export default Page