import React from 'react'
import MainTestPage from './componenets/MainTestPage'
import '@/styles/tiptap.css'
import Test, { ITest } from '@/models/Test';
import dbConnect from '@/config/db';
import { Metadata } from 'next';

interface TestPageProps {
    params: Promise<{ id: string }>; // Accessing the dynamic id from URL
}

type Props = {
    params: Promise<{ id: string }>; // Accessing the dynamic id from URL
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = (await params).id;
    await dbConnect();
    const test = await Test.findById(id)?.lean() as unknown as ITest;

    return {
        title: `${test.name} - LabTesto`,
        description: test.description?.split('.')[0] || "Book lab tests easily online with LabTesto.",
        openGraph: {
            title: `${test.name} - LabTesto`,
            description: test.description?.split('.')[0] || "Book lab tests easily online with LabTesto.",
            url: `${process.env.NEXT_PUBLIC_APP_URL}/tests/${test._id}`,
        },
    };
}

export default async function TestPage({ params }: TestPageProps) {
    const id = (await params).id;
    await dbConnect();
    const res = await Test.findById(id)?.lean();
    if (res) {
        return <MainTestPage test={JSON.parse(JSON.stringify(res))} />
    }
    return <div>Test not found</div>
}