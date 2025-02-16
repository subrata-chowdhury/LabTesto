"use client"
import React, { useEffect, useState } from 'react'
import CollectorForm, { CollectorDetails } from '../../components/CollectorForm';
import { useParams } from 'next/navigation';
import fetcher from '@/lib/fetcher';

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

    useEffect(() => {
        getCollectorDetails(id);
    }, [id])

    const handleSave = () => {
        // Implement save logic here
        console.log('Collector details saved:', collectorDetails);
    };

    async function getCollectorDetails(id: string) {
        const res = await fetcher.get<CollectorDetails>(`/collectors/${id}`);
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