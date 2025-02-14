"use client"
import React, { useEffect, useState } from 'react'
import TestForm, { TestDetails } from '../../components/CartForm';
import { useParams } from 'next/navigation';
import fetcher from '@/lib/fetcher';

const Page = () => {
    const [testDetails, setTestDetails] = useState<TestDetails>({
        name: '',
        sampleType: 'Blood',
        tubeType: 'Clot/Plain tube (red color cap)',
        description: '',
        fastingRequired: '',
        overview: '',
        testResultInterpretation: '',
        riskAssesment: '',
        resultTime: ''
    });

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        getTestDetails(id);
    }, [id])

    const handleSave = () => {
        // Implement save logic here
        console.log('Test details saved:', testDetails);
    };

    async function getTestDetails(id: string) {
        const res = await fetcher.get<TestDetails>(`/tests/${id}`);
        if (res.body && res.status === 200)
            setTestDetails({
                name: res.body.name || '',
                sampleType: res.body.sampleType || '',
                tubeType: res.body.tubeType || '',
                description: res.body.description || '',
                fastingRequired: res.body.fastingRequired || '',
                overview: res.body.overview || '',
                testResultInterpretation: res.body.testResultInterpretation || '',
                riskAssesment: res.body.riskAssesment || '',
                resultTime: res.body.resultTime || ''
            });
    }

    return (
        <TestForm
            testDetails={testDetails}
            onChange={{
                testDetails: setTestDetails
            }}
            onSave={handleSave}
        />
    )
}

export default Page;