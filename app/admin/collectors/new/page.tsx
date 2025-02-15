"use client"
import React, { useState } from 'react'
import CollectorForm, { CollectorDetails } from '../components/CollectorForm';
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

    const handleSave = async () => {
        const res = await fetcher.post('/collectors', collectorDetails);
        if (res.status === 200) {
            alert('Collector saved successfully');
            console.log('Collector details saved:', collectorDetails);
        } else {
            alert('Error saving collector');
            console.error('Error saving collector:', res.body);
        }
    };

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