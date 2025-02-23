"use client"
import React, { useState } from 'react'
import TestForm, { TestDetails } from '../components/TestsForm';
import fetcher from '@/lib/fetcher';
import { toast } from 'react-toastify';

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

    const handleSave = async () => {
        const res = await fetcher.post('/tests', testDetails);
        if(res.status === 200) {
            toast.success('Test saved successfully');
            console.log('Test details saved:', testDetails);
        } else {
            toast.error(res.error || "Error saing Test")
            console.error('Error saving test:', res.body);
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