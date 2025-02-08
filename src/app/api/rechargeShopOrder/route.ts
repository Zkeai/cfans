import connectDB from "@/lib/db";
import { ShopOrder } from "@/models/ShopOrder";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectDB()
    const { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ success: false, error: "Missing userId parameter" }, { status: 400 });
    }

    try {
        // 查询用户的所有订单
        const orders = await ShopOrder.find({ userId });

        if (!orders || orders.length === 0) {
            return NextResponse.json({ success: false, orders: [] }, { status: 200 });
        }

        // 返回订单列表
        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }

}