"use client"
import React, { useEffect, useState } from 'react'
import CollectorForm, { CollectorDetails } from '../../components/CollectorForm';
import { useParams, useRouter } from 'next/navigation';
import fetcher from '@/lib/fetcher';
import { toast } from 'react-toastify';

const Page = () => {
    const [collectorDetails, setCollectorDetails] = useState<CollectorDetails>({
        name: '',
        email: '',
        password: '',
        phone: '',

        adhaar: '',
        experience: 0,
        qualification: [],
    });

    const { id } = useParams<{ id: string }>();
    const navigator = useRouter();

    useEffect(() => {
        getCollectorDetails(id);
    }, [id])

    const handleSave = async () => {
        const res = await fetcher.post<CollectorDetails, { messege: string }>(`/admin/collectors/${id}`, collectorDetails);
        if (res.body && res.status === 200) {
            toast.success('Collector saved successfully');
            navigator.replace('/admin/collectors');
        } else {
            toast.error(res.error || 'Error saving data')
        }
    };

    async function getCollectorDetails(id: string) {
        const res = await fetcher.get<CollectorDetails>(`/admin/collectors/${id}`);
        if (res.body && res.status === 200)
            setCollectorDetails({
                name: res.body.name,
                email: res.body.email,
                password: res.body.password,
                phone: res.body.phone,
                adhaar: res.body.adhaar,
                experience: res.body.experience,
                qualification: res.body.qualification
            });
    }

    return (
        <CollectorForm
            collectorDetails={collectorDetails}
            onChange={{
                collectorDetails: setCollectorDetails
            }}
            onSave={handleSave}
        />
    )
}

export default Page;