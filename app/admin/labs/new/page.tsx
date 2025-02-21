'use client'
import React from 'react'
import fetcher from '@/lib/fetcher'
import AboutForm, {LabAboutDetails} from '../components/AboutForm'

const Page = () => {
    const [labDetails, setLabDetails] = React.useState<LabAboutDetails>({
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

    async function saveLab() {
        const res = await fetcher.post<LabAboutDetails, { messege: string }>('/labs', labDetails);
        if (res.status === 200) {
            alert('Lab saved successfully');
        } else {
            alert('Error saving lab');
        }
    }

    return (
        <>
            <AboutForm
                labDetails={labDetails}
                onChange={setLabDetails }
                onSave={() => saveLab()}
            />
        </>
    )
}

export default Page