"use client"
import React, { useState } from 'react'
import CollectorForm, { CollectorDetails } from '../components/CollectorForm';
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

    const handleSave = async () => {
        const res = await fetcher.post('/admin/collectors', collectorDetails);
        if (res.status === 200) {
            toast.success('Collector saved successfully');
            console.log('Collector details saved:', collectorDetails);
        } else {
            toast.error(res.error || 'Error saving collector');
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