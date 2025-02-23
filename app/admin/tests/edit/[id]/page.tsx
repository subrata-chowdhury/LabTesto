"use client"
import React, { useEffect, useState } from 'react'
import TestForm, { TestDetails } from '../../components/TestsForm';
import { useParams } from 'next/navigation';
import fetcher from '@/lib/fetcher';
import { toast } from 'react-toastify';

const Page = () => {
    const [testDetails, setTestDetails] = useState<TestDetails>({
        name: '',
        sampleType: 'Blood',
        tubeType: 'Clot Tube',
        otherTerms: [],
        description: '',
        fastingRequired: '',
        overview: '',
        testResultInterpretation: '',
        riskAssesment: '',
    });

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        getTestDetails(id);
    }, [id])

    const handleSave = async () => {
        const res = await fetcher.post<TestDetails, { messege: string }>(`/tests/${id}`, testDetails);
        if (res.status === 200) {
            toast.success('Test Updated Successfully')
        }
    };

    async function getTestDetails(id: string) {
        const res = await fetcher.get<TestDetails>(`/tests/${id}`);
        if (res.body && res.status === 200)
            setTestDetails({
                name: res.body.name || '',
                otherTerms: res.body.otherTerms || '',
                sampleType: res.body.sampleType || '',
                tubeType: res.body.tubeType || '',
                description: res.body.description || '',
                fastingRequired: res.body.fastingRequired || '',
                overview: res.body.overview || '',
                testResultInterpretation: res.body.testResultInterpretation || '',
                riskAssesment: res.body.riskAssesment || '',
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