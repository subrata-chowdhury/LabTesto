import React from 'react'
import MainTestPage from './componenets/MainTestPage'
import '@/styles/tiptap.css'
import Test from '@/models/Test';
import dbConnect from '@/config/db';

interface TestPageProps {
    params: Promise<{ id: string }>; // Accessing the dynamic id from URL
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