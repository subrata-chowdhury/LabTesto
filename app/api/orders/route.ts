// url /api/order
import dbConnect from '@/config/db';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import Cart from '@/models/Cart';
import Test from '@/models/Test';
import Lab from '@/models/Lab';
import Collector from '@/models/Collector';

export async function GET(req: NextRequest) {
    try {
        const id = await req.cookies.get('userId')?.value;

        if (!id) {
            return new NextResponse('User ID is required', { status: 400 });
        }

        await dbConnect();

        try {
            const order = await Order.find({ user: id }).populate({ path: 'items.product.test', model: Test }).populate({ path: 'items.product.lab', model: Lab });

            if (!order) {
                const orderData = {
                    user: id,
                    items: []
                };

                const order = new Order(orderData);

                try {
                    await order.save();
                    return NextResponse.json([], { status: 200 });
                } catch (e) {
                    console.log(e);
                    return new NextResponse('Error creating order', { status: 500 });
                }
            }

            return NextResponse.json(order, { status: 200 });
        } catch (e) {
            console.log(e)
            return new NextResponse('Error fetching order', { status: 500 });
        }
    } catch {
        return new NextResponse('Error fetching orders', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = await req.cookies.get('userId')?.value;
        if (!userId) {
            return new NextResponse('User not authenticated', { status: 401 });
        }

        const body = await req.json();
        if (!Array.isArray(body) || body.length === 0) {
            return new NextResponse('Request body is missing or invalid', { status: 400 });
        }

        await dbConnect();

        for (const item of body) {
            if (!item.product?.test || !item.product?.lab) {
                return new NextResponse('Product test and lab are required', { status: 400 });
            }
            if (typeof item.quantity !== 'number' || item.quantity <= 0) {
                return new NextResponse('Quantity must be a positive number', { status: 400 });
            }
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return new NextResponse('Cart not found for user', { status: 404 });
        }

        for (const item of body) {
            const cartItem = cart.items.find((cartItem: { product: { test: string, lab: string } }) =>
                cartItem.product.test.toString() === item.product.test &&
                cartItem.product.lab.toString() === item.product.lab
            );
            if (!cartItem || cartItem.patientDetails.length !== item.quantity) {
                return new NextResponse('Quantity must match the number of patient details', { status: 400 });
            }
        }

        const orderItems = body.map(item => {
            const cartItem = cart.items.find((cartItem: { product: { test: string, lab: string } }) =>
                cartItem.product.test.toString() === item.product.test &&
                cartItem.product.lab.toString() === item.product.lab
            );

            cart.items = cart.items.filter((cartItem: { product: { test: string, lab: string } }) =>
                !(cartItem.product.test.toString() === item.product.test &&
                    cartItem.product.lab.toString() === item.product.lab)
            );

            if (!cartItem) {
                throw new Error('Cart item not found');
            }

            return {
                product: {
                    test: cartItem.product.test,
                    lab: cartItem.product.lab,
                    price: cartItem.product.price,
                },
                patientDetails: cartItem.patientDetails,
                quantity: item.quantity,
                date: new Date()
            };
        });

        const collectors = await Collector.find({});
        if (collectors.length === 0) {
            return new NextResponse('No verified collectors available', { status: 500 });
        }
        const randomCollector = collectors[Math.floor(Math.random() * collectors.length)]._id;

        const orderData = {
            items: orderItems,
            address: cart.address,
            user: userId,
            status: 'Ordered',
            sampleTakenDateTime: { date: { start: new Date(), end: new Date() } },
            reportDeliverTime: { date: { start: new Date(), end: new Date() } },
            collector: randomCollector
        };

        const order = new Order(orderData);
        await order.save();

        await (await order.populate('items.product.test')).populate('items.product.lab')


        type Item = {
            product: { test: { name: string }, lab: { name: string } },
            patientDetails: {
                name: string;
                phone: string;
                address: {
                    pin: number;
                    other: string;
                }
            }[]
        }

        await fetch('https://api.telegram.org/bot7846622941:AAEjj6UdF2C42GG_S1RVvK2oPhmRxFUCukA/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: -4659804693,
                text: `
                ${order.items.map((e: Item) => `Test: ${e.product.test.name}, \nLab: ${e.product.lab.name}, \nPatients: ${e.patientDetails.map(e2 => `\n    name: ${e2.name},\n    phNo: ${e2.phone},\n    address: ${e2.address.pin},\n    other: ${e2.address.other || 'none'}\n`)}`)}                
                `
            })
        })

        await cart.save();

        return NextResponse.json({ message: 'Order saved successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Error processing order', { status: 500 });
    }
}