import dbConnect from "@/config/db";
import Collector from "@/models/Collector";
import Lab from "@/models/Lab";
import Order, { IOrder } from "@/models/Order";
import Test from "@/models/Test";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const id = req.url.split('/').pop();
        const userId = await req.headers.get('x-user');

        if (!id) {
            return new NextResponse('Order ID is required', { status: 400 });
        }

        await dbConnect();

        try {
            const order = await Order.findOne({ _id: id, user: userId }).populate({ path: 'items.product.test', model: Test }).populate({ path: 'items.product.lab', model: Lab }).populate({ path: 'collector', model: Collector });

            return NextResponse.json(order, { status: 200 });
        } catch (e) {
            console.log(e)
            return new NextResponse('Error fetching order', { status: 500 });
        }
    } catch {
        return new NextResponse('Error fetching orders', { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const userId = await req.headers.get('x-user');
    const body = await req.json();

    if (!userId) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    await dbConnect();

    try {
        const existingOrder = await Order.findById(req.url.split('/').pop());

        if (!existingOrder) {
            return new NextResponse('Order not found', { status: 404 });
        }

        existingOrder.status = body.status || existingOrder.status;

        if (body.review) {
            const reviewIndex = (existingOrder as IOrder).review.findIndex((r) => r.test.toString() === body.review.test && r.lab.toString() === body.review.lab);

            if (reviewIndex !== -1) {
                existingOrder.review[reviewIndex] = {
                    lab: body.product.lab,
                    test: body.product.test,
                    ...body.review
                };
            } else {
                existingOrder.review.push({
                    lab: body.product.lab,
                    test: body.product.test,
                    ...body.review
                });
            }

            const { labRating, collectorRating } = body.review;

            if (collectorRating) {
                const collector = await Collector.findById(body.product.test);
                if (collector) {
                    collector.rating = ((collector.rating * collector.rated) + collectorRating) / (collector.rated + 1);
                    collector.rated += 1;
                    await collector.save();
                }
            }

            if (labRating) {
                const lab = await Lab.findById(body.product.lab);
                if (lab) {
                    lab.rating = ((lab.rating * lab.rated) + labRating) / (lab.rated + 1);
                    lab.rated += 1;
                    await lab.save();
                }
            }
        }
        await existingOrder.save();
        existingOrder.populate({ path: 'collector', model: Collector });
        await existingOrder.populate({
            path: 'items.product.test',
            select: 'name',
            model: Test
        })
        await existingOrder.populate({
            path: 'items.product.lab',
            select: 'name',
            model: Lab
        });

        type Item = {
            product: { test: { name: string }, lab: { name: string } },
            patientDetails: {
                name: string;
                gender: 'Male' | 'Female' | 'Other';
                age: number;
                other?: string;
            }[]
        };
        if (existingOrder.status === 'Canceled') {
            await fetch('https://api.telegram.org/bot7846622941:AAEjj6UdF2C42GG_S1RVvK2oPhmRxFUCukA/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: existingOrder.collector.chatId || -4659804693,
                    text: `
Order ID: ${existingOrder._id}

Status: ${existingOrder.status}!!!!!!

${existingOrder.items.map((e: Item) => `
Test: ${e.product.test.name},
Lab: ${e.product.lab.name}, 

Patients: ${e.patientDetails.map(e2 => `
    Name: ${e2.name},
    Age: ${e2.age || 'none'},
    Gender: ${e2.gender || 'none'}\n`).join('')}`).join('\n')}

Address: 
    Pin: ${existingOrder.address.pin}, 
    City: ${existingOrder.address.city}, 
    Phone: ${existingOrder.address.phone}, 
    Landmark: ${existingOrder.address.other || 'none'}
    
Sample Taken Time:
    Start: ${existingOrder.sampleTakenDateTime.start},
    End: ${existingOrder.sampleTakenDateTime.end}
            `
                })
            });
        }
        return NextResponse.json({ message: 'Order updated successfully' }, { status: 200 });
    } catch (e) {
        console.log(e);
        return new NextResponse('Error updating order', { status: 500 });
    }
}