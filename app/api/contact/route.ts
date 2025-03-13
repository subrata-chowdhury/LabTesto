import { NextRequest, NextResponse } from 'next/server';
import Contact from '@/models/Contact';
import dbConnect from '@/config/db';

export async function POST(req: NextRequest) {
    const id = await req.headers.get('x-user');
    await dbConnect();

    try {
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const newContact = new Contact({
            name,
            email,
            subject,
            message,
            user: id
        });

        await newContact.save();

        return NextResponse.json({ message: 'Details are sent successfully' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}