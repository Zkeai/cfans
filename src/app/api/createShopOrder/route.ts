import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { ShopOrder } from "@/models/ShopOrder";
import { User } from "@/models/User";



export async function POST(req: NextRequest) {
    connectDB()
    try {
        // 从请求体中解析参数
        const { selectedService, link, quantity, calculatedPrice, userId } = await req.json();
        // 检查必需参数是否存在
        if (!selectedService || !link || !quantity || !calculatedPrice || !userId) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }
        //检查余额是否够
        let query;
        if (userId.length !== 24) {
            // authProviderId 格式检查
            query = { authProviderId: userId };
        } else if (userId.length === 24) {
            // _id 格式检查
            query = { _id: userId };
        } else {
            return NextResponse.json({ success: false, message: "异常订单" }, { status: 200 });
        }
        const user = await User.findOne(query);

        if (!user) {
            return NextResponse.json({ success: false, message: "异常订单" }, { status: 200 });
        }
        if (Number(user.balance) - Number(calculatedPrice) < 0) {
            return NextResponse.json({ success: false, message: "余额不足" }, { status: 200 });
        }

        // 创建订单
        const createdAt = new Date(Date.now());
        const order = await ShopOrder.create({ userId: userId, url: link, amount: calculatedPrice, num: quantity, server: selectedService, createdAt });

        if (!order) {
            return NextResponse.json({ success: false, message: "订单失败" }, { status: 200 });
        }
        //扣款
        user.balance = parseFloat((Number(user.balance || 0) - Number(calculatedPrice)).toFixed(2));

        await user.save();
        // 返回成功响应
        return NextResponse.json({ success: false, message: "success", order: order });
    } catch (error) {
        console.error("Error", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}