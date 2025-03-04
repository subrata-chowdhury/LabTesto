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
    const [error, setError] = useState<{ [key in keyof TestDetails]?: string } | null>(null);
    const navigate = useRouter();

    const handleSave = async () => {
        // verification
        const error: { [key in keyof TestDetails]?: string } = {};
        if (!testDetails.name) error.name = "Name is required";
        if (!testDetails.sampleType) error.sampleType = "Sample type is required";
        if (!testDetails.tubeType) error.tubeType = "Tube type is required";
        if (!testDetails.fastingRequired) error.fastingRequired = "Fasting requirement is required";
        if (!testDetails.tempOverview) error.overview = "Overview is required";
        if (!testDetails.tempTestResultInterpretation) error.testResultInterpretation = "Test result interpretation is required";
        if (Object.keys(error).length > 0) {
            setError(error);
            return;
        }

        const res = await fetcher.post('/admin/tests', {
            ...testDetails,
            description: testDetails.tempDescription || testDetails.description || '',
            overview: testDetails.tempOverview || testDetails.overview || '',
            testResultInterpretation: testDetails.tempTestResultInterpretation || testDetails.testResultInterpretation || '',
            riskAssesment: testDetails.tempRiskAssesment || testDetails.riskAssesment || '',
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
            error={error}
            onSave={handleSave}
        />
    )
}

export default Page;