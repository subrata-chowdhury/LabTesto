import React from 'react'
import MainTestPage from './componenets/MainTestPage'
import '@/styles/tiptap.css'

interface TestPageProps {
    params: Promise<{ id: string }>; // Accessing the dynamic id from URL
}

export default async function Test({ params }: TestPageProps) {
    const id = (await params).id;
    const res = await fetch(`https://labtesto.vercel.app/api/tests/${id}`);
    if (res.status === 200) {
        const body = await res.json();
        return <MainTestPage test={body} />
    }
    return <div>Test not found</div>
}