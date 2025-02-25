'use client'
import React, { useState } from 'react'
import fetcher from '@/lib/fetcher'
import AboutForm, { LabAboutDetails } from '../components/AboutForm'
import { toast } from 'react-toastify'

const Page = () => {
    const [labDetails, setLabDetails] = useState<LabAboutDetails>({
        name: '',
        description: '',
        location: {
            address: {
                pin: '',
                city: '',
                district: '',
                other: ''
            },
            location: {
                lat: 0,
                lang: 0
            }
        }
    })
    const [loading, setLoading] = useState(false);

    async function saveLab() {
        setLoading(true);
        const res = await fetcher.post<LabAboutDetails, { messege: string }>('/labs', {...labDetails, description: labDetails.tempDescription});
        if (res.status === 200) {
            toast.success('Lab saved successfully');
        } else {
            toast.error(res.error || 'Error saving lab');
        }
        setLoading(false);
    }

    return (
        <>
            <AboutForm
                labDetails={labDetails}
                loading={loading}
                onChange={setLabDetails}
                onSave={() => saveLab()}
            />
        </>
    )
}

export default Page