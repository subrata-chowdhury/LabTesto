"use client"
import React, { useEffect, useState } from 'react'
import TestForm, { TestDetails } from '../../components/TestsForm';
import { useParams, useRouter } from 'next/navigation';
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
    const [loading, setLoading] = useState(false);

    const { id } = useParams<{ id: string }>();
    const navigate = useRouter();

    useEffect(() => {
        getTestDetails(id);
    }, [id])

    const handleSave = async () => {
        setLoading(true);
        const res = await fetcher.post<TestDetails, { messege: string }>(`/tests/${id}`, {
            ...testDetails,
            description: testDetails.tempDescription || testDetails.description || '',
            overview: testDetails.tempOverview || testDetails.overview || '',
            testResultInterpretation: testDetails.tempTestResultInterpretation || testDetails.testResultInterpretation || '',
            riskAssesment: testDetails.tempRiskAssesment || testDetails.riskAssesment || '',
        });
        if (res.status === 200) {
            toast.success('Test Updated Successfully');
            navigate.push('/admin/tests');
        } else {
            toast.error(res.error || "Error updating Test");
        }
        setLoading(false)
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
            loading={loading}
            onChange={{
                testDetails: setTestDetails
            }}
            onSave={handleSave}
        />
    )
}

export default Page;