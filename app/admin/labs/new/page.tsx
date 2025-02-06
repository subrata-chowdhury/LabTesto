'use client'
import React from 'react'
import LabForm, { LabDetails } from '../components/LabForm'
import fetcher from '@/lib/fetcher'

const Page = () => {
    const [labDetails, setLabDetails] = React.useState<LabDetails>({
        name: '',
        location: { address: '', location: { lat: 0, lang: 0 } },
        prices: [],
        ranges: [],
    })

    async function saveLab() {
        const res = await fetcher.post<LabDetails, { messege: string }>('/labs', labDetails);
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