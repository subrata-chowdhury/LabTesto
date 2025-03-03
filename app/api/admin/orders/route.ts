import dbConnect from "@/config/db";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = await JSON.parse(searchParams.get('filter') || '{}');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        await dbConnect();

        const orders = await Order.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);

        const totalCarts = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalCarts / limit);

        return NextResponse.json({
            orders,
            pagination: {
                totalCarts,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch {
        return new NextResponse('Error fetching carts', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        await dbConnect();

        // Verification logic
        if (!data.user) {
            return new NextResponse('User ID is required', { status: 400 });
        }
        if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
            return new NextResponse('At least one item is required', { status: 400 });
        }
        for (const item of data.items) {
            if (!item.product || !item.product.test || !item.product.lab || !item.product.price) {
                return new NextResponse('Each item must have a product with test, lab, and price', { status: 400 });
            }
            if (item.patientDetails?.length > 0)
                for (const patient of item.patientDetails) {
                    if (!patient.name || !patient.gender || !patient.age) {
                        return new NextResponse('Each patient detail must have name, gender, and age', { status: 400 });
                    }
                }
        }
        if (!data.address || !data.address.pin || !data.address.city || !data.address.district || !data.address.phone) {
            return new NextResponse('Address must have pin, city, district, and phone', { status: 400 });
        }

        const newOrder = new Order(data);
        await newOrder.save();

        return NextResponse.json(newOrder, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Error creating order', { status: 500 });
    }
}