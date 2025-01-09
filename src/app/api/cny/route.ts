import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    await connectDB()
    const { orderId } = await req.json();

    if (!orderId) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }


    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ cnyAmount: order.cnyAmount }, { status: 200 });
    } catch (error) {
        console.error("Error fetching cnyAmount:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }


}

