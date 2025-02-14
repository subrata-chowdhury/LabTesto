import dbConnect from "@/config/db";
import Cart from "@/models/Cart";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const id = req.url.split('/').pop();
        await dbConnect();

        const cart = await Cart.findByIdAndDelete(id);
        if (!cart) {
            return new NextResponse('Cart not found', { status: 404 });
        }
        return new NextResponse('Cart deleted', { status: 204 });
    } catch {
        return new NextResponse('Error deleting carts', { status: 500 });
    }
}