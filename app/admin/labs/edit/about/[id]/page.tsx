'use client'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import fetcher from '@/lib/fetcher'
import AboutForm, { LabAboutDetails } from '../../../components/AboutForm'

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

    const { id } = useParams();

    useEffect(() => {
        fetcher.get<FetchedLabDetails>(`/labs/${id}`).then((res) => {
            if (res.status === 200 && res.body) {
                const labDetails: LabAboutDetails = {
                    name: res.body.name,
                    description: res.body.description,
                    location: res.body.location,
                    certification: res.body.certification,
                };
                setLabDetails(labDetails);
            }
        })
    }, [id])

    async function saveLab() {
        const res = await fetcher.post<LabAboutDetails, { messege: string }>(`/labs/${id}`, labDetails);
        if (res.status === 200) {
            alert('Lab saved successfully');
        } else {
            alert('Error saving lab');
        }
    }

    return (
        <>
            <AboutForm labDetails={labDetails} onChange={(labDetails) => setLabDetails(labDetails)} onSave={saveLab} />
        </>
    )
}

type FetchedLabDetails = {
    name: string,
    description?: string,
    location: {
        address: {
            pin: string,
            city: string,
            district: string,
            other: string, // road details 
        },
        location: {
            lat: number,
            lang: number
        }
    },
    certification?: {
        organization?: string,
        year?: number,
        imageUrl?: string
    }[],
}

export default Page