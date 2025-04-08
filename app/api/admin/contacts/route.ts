import dbConnect from "@/config/db";
import AdminUser from "@/models/AdminUser";
import Contact from "@/models/Contact";
import User from "@/models/User";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const filter = await JSON.parse(searchParams.get('filter') || '{}');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    await dbConnect();


    if (filter.name) {
        if (isValidObjectId(filter.name)) {
            filter._id = filter.name
        } else {
            const totalOrders = await Contact.countDocuments(filter);
            const totalPages = Math.ceil(totalOrders / limit);
            return NextResponse.json({
                contacts: [],
                pagination: {
                    totalOrders,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            });
        }
    }
    delete filter.name;

    if (filter.date) {
        const date = new Date(new Date(filter.date).setHours(0, 0, 0, 0));
        const nextDay = new Date(date);
        nextDay.setHours(23, 59, 59, 999);

        filter.createdAt = {
            $gte: date.toISOString(),
            $lt: nextDay.toISOString(),
        };
        delete filter.date;
    }

    const contacts = await Contact.find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .populate({ path: 'user', model: User })
        .populate({ path: 'resolvedBy', model: AdminUser });

    const totalOrders = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json({
        contacts,
        pagination: {
            totalOrders,
            totalPages,
            currentPage: page,
            pageSize: limit,
        },
    });
}