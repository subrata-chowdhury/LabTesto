// url /api/order
import dbConnect from '@/config/db';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import Cart from '@/models/Cart';
import Test, { ITest } from '@/models/Test';
import Lab from '@/models/Lab';
import Collector from '@/models/Collector';

export async function GET(req: NextRequest) {
    try {
        const id = await req.headers.get('x-user');

        if (!id) {
            return new NextResponse('User ID is required', { status: 400 });
        }

        await dbConnect();

        try {
            const order = await Order.find({ user: id }).populate({ path: 'items.product.test', model: Test }).populate({ path: 'items.product.lab', model: Lab }).populate({ path: 'collector', model: Collector });

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
        const userId = await req.headers.get('x-user');
        if (!userId) {
            return new NextResponse('User not authenticated', { status: 401 });
        }

        const body = await req.json();
        if (!Array.isArray(body.items) || body.items.length === 0) {
            return new NextResponse('Request body is missing or invalid', { status: 400 });
        }

        await dbConnect();

        for (const item of body.items) {
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

        // for (const item of body.items) {
        //     const cartItem = cart.items.find((cartItem: { product: { test: string, lab: string } }) =>
        //         cartItem.product.test.toString() === item.product.test &&
        //         cartItem.product.lab.toString() === item.product.lab
        //     );
        //     if (!cartItem || cartItem.patientDetails.length !== item.quantity) {
        //         return new NextResponse('Quantity must match the number of patient details', { status: 400 });
        //     }
        // }

        const orderItems: OrderItem[] = await Promise.all(body.items.map(async (item: { product: Product; quantity: number; address: { pin: string; city: string; phone: string; other?: string; } }) => {
            const cartItemIndex = cart.items.findIndex((cartItem: CartItem) =>
                cartItem.product.test.toString() === item.product.test &&
                cartItem.product.lab.toString() === item.product.lab
            );

            if (cartItemIndex === -1) {
                throw new Error('Cart item not found');
            }

            const cartItem = cart.items[cartItemIndex];

            cart.items.splice(cartItemIndex, 1);

            if (!cartItem) {
                throw new Error('Cart item not found');
            }

            const test = await Test.findById(item.product.test).select('labsDetails').lean() as unknown as ITest;
            if (!test) {
                throw new Error('Test not found');
            }

            const priceDetails = (test.labsDetails || {})[item.product.lab];
            if (!priceDetails) {
                throw new Error('Price details not found for the test in the lab');
            }

            return {
                product: {
                    test: cartItem.product.test,
                    lab: cartItem.product.lab,
                    price: priceDetails.price || 0,
                    expenses: priceDetails.expenses || 0
                },
                patientDetails: cartItem.patientDetails,
                quantity: item.quantity,
                date: new Date(),
                address: item.address
            };
        }));

        const collectors = await Collector.find({});
        if (collectors.length === 0) {
            return new NextResponse('No verified collectors available', { status: 500 });
        }
        const randomCollector = collectors[Math.floor(Math.random() * collectors.length)]._id;

        const orderData = {
            items: orderItems,
            user: userId,
            status: 'Ordered',
            address: body.address,
            sampleTakenDateTime: body.sampleTakenDateTime || { start: new Date(), end: new Date() },
            reportDeliverTime: body.reportDeliverTime || { start: new Date(), end: new Date() },
            collector: randomCollector
        };

        const order = new Order(orderData);
        await order.save();

        await (await order.populate('items.product.test')).populate('items.product.lab');

        type Item = {
            product: { test: { name: string }, lab: { name: string } },
            patientDetails: {
                name: string;
                gender: 'Male' | 'Female' | 'Other';
                age: number;
                other?: string;
            }[]
        };

        await fetch('https://api.telegram.org/bot7846622941:AAEjj6UdF2C42GG_S1RVvK2oPhmRxFUCukA/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: randomCollector.chatId || -4659804693,
                text: `
Order ID: ${order._id}
${order.items.map((e: Item) => `
Test: ${e.product.test.name},
Lab: ${e.product.lab.name}, 

Patients: ${e.patientDetails.map(e2 => `
    Name: ${e2.name},
    Age: ${e2.age || 'none'},
    Gender: ${e2.gender || 'none'}\n`).join('')}`).join('\n')}

Address: 
    Pin: ${order.address.pin}, 
    City: ${order.address.city}, 
    Phone: ${order.address.phone}, 
    Landmark: ${order.address.other || 'none'}
    
Sample Taken Time:
    Start: ${order.sampleTakenDateTime.start},
    End: ${order.sampleTakenDateTime.end}
            `
            })
        });

        await cart.save();

        return NextResponse.json({ message: 'Order saved successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Error processing order', { status: 500 });
    }
}


interface Product {
    test: string;
    lab: string;
}

interface CartItem {
    product: Product;
    patientDetails: {
        name: string;
        gender: 'Male' | 'Female' | 'Other';
        age: number;
        other?: string;
    }[];
}

interface OrderItem {
    product: {
        test: string;
        lab: string;
        price: number;
        expenses: number;
    };
    patientDetails: {
        name: string;
        gender: 'Male' | 'Female' | 'Other';
        age: number;
        other?: string;
    }[];
    quantity: number;
    date: Date;
    address: {
        pin: string;
        city: string;
        phone: string;
        other?: string;
    };
}