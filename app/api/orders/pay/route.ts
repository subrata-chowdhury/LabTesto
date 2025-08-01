import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
    const { amount, currency = "INR", id } = await req.json();

    if (!amount || !id) {
        return NextResponse.json({ error: "Amount and Order ID are required" }, { status: 400 });
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
        amount: amount * 100, // amount in paise
        currency,
        receipt: "receipt_order_" + (await Order.findById(id))?.id,
    };

    try {
        const order = await razorpay.orders.create(options);
        return NextResponse.json({ orderId: order.id }, { status: 200 });
    } catch (err) {
        console.error("Razorpay order creation failed:", err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}