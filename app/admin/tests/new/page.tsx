"use client"
import React, { useState } from 'react'
import TestForm, { TestDetails } from '../components/TestsForm';
import fetcher from '@/lib/fetcher';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Page = () => {
    const [testDetails, setTestDetails] = useState<TestDetails>({
        name: '',
        otherTerms: [],
        sampleType: 'Blood',
        tubeType: 'Clot Tube',
        description: '',
        fastingRequired: '',
        overview: '',
        testResultInterpretation: '',
        riskAssesment: '',
    });
    const navigate = useRouter();

    const handleSave = async () => {
        const res = await fetcher.post('/tests', {
            ...testDetails,
            description: testDetails.tempDescription || '',
            overview: testDetails.tempOverview || '',
            testResultInterpretation: testDetails.tempTestResultInterpretation || '',
            riskAssesment: testDetails.tempRiskAssesment || ''
        });
        if (res.status === 200) {
            toast.success('Test saved successfully');
            navigate.push('/admin/tests');
        } else {
            toast.error(res.error || "Error saing Test")
        }
    };

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