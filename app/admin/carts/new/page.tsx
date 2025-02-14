"use client"
import React, { useState } from 'react'
import TestForm, { TestDetails } from '../components/CartForm';
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

    const handleSave = async () => {
        const res = await fetcher.post('/tests', testDetails);
        if(res.status === 200) {
            alert('Test saved successfully');
            console.log('Test details saved:', testDetails);
        } else {
            alert('Error saving test');
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