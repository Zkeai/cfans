import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { monitorUSDTTransfer } from "@/lib/usdt";

connectDB()

export async function POST(req: NextRequest) {
    const { userId, address, amount, cnyAmount } = await req.json();
    if (Number(cnyAmount) < 0 || Number(amount < 0)) {
        return NextResponse.json({ error: "price error" }, { status: 400 });
    }

    if (!amount) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 10分钟后过期
    const order = await Order.create({ userId, amount, cnyAmount, address, expiresAt });



    return NextResponse.json({ orderId: order._id });
}

export async function GET(req: Request) {
    // 连接数据库
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    try {
        // 查询订单
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// New PATCH method to update the address of an order

export async function PATCH(req: NextRequest) {
    await connectDB();

    try {
        const { id, address } = await req.json();

        if (!id || !address) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        order.address = address;
        await order.save();
        console.log(address, order.amount)
        monitorUSDTTransfer(order.id, address, order.amount)
            .then(async (success) => {
                if (success) {
                    order.status = "success";
                } else {
                    order.status = "expired";
                }
                await order.save();
            })
            .catch(async (err) => {
                console.error(err);
                order.status = "failed";
                await order.save();
            });
        return NextResponse.json({ message: "Order address updated successfully", order }, { status: 200 });
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

