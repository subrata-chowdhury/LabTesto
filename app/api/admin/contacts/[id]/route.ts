import dbConnect from "@/config/db";
import Contact from "@/models/Contact";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";;
import User from "@/models/User";
import AdminUser from "@/models/AdminUser";

export async function GET(req: NextRequest) {
    try {
        const id = await req.url.split('/').pop();

        if (!id) {
            return new NextResponse('ID is required', { status: 400 });
        }

        await dbConnect();

        try {
            const contact = await Contact.findById(id)
                .populate({ path: 'user', model: User })
                .populate({ path: 'resolvedBy', model: AdminUser });
            return NextResponse.json(contact, { status: 200 });
        } catch (e) {
            console.log(e)
            return new NextResponse('Error fetching order', { status: 500 });
        }
    } catch {
        return new NextResponse('Error fetching orders', { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { status } = await req.json();
    const adminUserId = await req.headers.get('x-user');
    await dbConnect();

    try {
        const contact = await Contact.findById(req.url.split('/').pop());
        if (!contact) {
            return new NextResponse('Contact not found', { status: 404 });
        }
        if (contact.status === status) {
            return new NextResponse('Contact already has this status', { status: 400 });
        }
        if (status === 'Pending' && contact.status === 'Resolved') {
            return new NextResponse('Contact cannot be changed from Resolved to Pending', { status: 400 });
        }
        if (status === 'Resolved') {
            contact.resolvedAt = new Date();
            contact.resolvedBy = adminUserId;
        }
        contact.status = status;
        await contact.save();

        return NextResponse.json(contact, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const id = req.url.split('/').pop();
    await dbConnect();

    try {
        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid contact ID' }, { status: 400 });
        }

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Contact deleted successfully' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}