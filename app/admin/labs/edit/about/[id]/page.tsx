'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import fetcher from '@/lib/fetcher'
import AboutForm, { LabAboutDetails } from '../../../components/AboutForm'
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

    const navigate = useRouter();
    const { id } = useParams();

    useEffect(() => {
        fetcher.get<FetchedLabDetails>(`/labs/${id}`).then((res) => {
            if (res.status === 200 && res.body) {
                const labDetails: LabAboutDetails = {
                    name: res.body.name,
                    image: res.body.image,
                    description: res.body.description,
                    location: res.body.location,
                    certification: res.body.certification,
                };
                setLabDetails(labDetails);
            }
        })
    }, [id])

    async function saveLab() {
        setLoading(true);
        const res = await fetcher.post<LabAboutDetails, { messege: string }>(`/admin/labs/${id}`, { ...labDetails, description: labDetails.tempDescription || labDetails.description || '' });
        if (res.status === 200) {
            toast.success('Lab saved successfully');
            navigate.push('/admin/labs');
        } else {
            toast.error(res.error || 'Error saving lab');
        }
        setLoading(false);
    }

    return (
        <>
            <AboutForm labDetails={labDetails} loading={loading} onChange={(labDetails) => setLabDetails(labDetails)} onSave={saveLab} />
        </>
    )
}

type FetchedLabDetails = {
    name: string,
    description?: string,
    image?: string,
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