import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "@/models/Order";

export async function POST(req: Request) {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, id } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !id) {
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    if (generated_signature === razorpay_signature) {
        // ✅ Transaction is verified using signature
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const payment = await razorpay.payments.fetch(razorpay_payment_id);

        if (payment.status === "captured") {
            const amountPaid = Number(payment.amount) / 100;
            const order = await Order.findByIdAndUpdate(id, {
                paid: amountPaid,
            }, { new: true });
            // ✅ Payment successful
            return NextResponse.json({ verified: true, order, message: "Payment verified" });
        }

    } else {
        // ❌ Tampered or invalid payment
        return NextResponse.json({ verified: false, message: "Invalid signature" }, { status: 400 });
    }
}
