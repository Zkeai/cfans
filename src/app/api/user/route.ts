import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

connectDB()


export async function POST(req: NextRequest) {
    try {
        // 从请求体中解析参数
        const { userId, amount, operation } = await req.json();

        // 检查必需参数是否存在
        if (!userId || amount == null || !operation) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // 判断操作类型是否有效
        if (!['add', 'sub'].includes(operation)) {
            return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
        }

        // 判断 userId 类型
        let query;
        if (userId.includes('-') && userId.length === 36) {
            // authProviderId 格式检查
            query = { authProviderId: userId };
        } else if (userId.length === 24) {
            // _id 格式检查
            query = { _id: userId };
        } else {
            return NextResponse.json({ error: "Invalid userId format" }, { status: 400 });
        }

        // 查找用户
        const user = await User.findOne(query);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 根据操作类型更新余额
        if (operation === 'add') {
            user.balance = parseFloat((Number(user.balance || 0) + Number(amount)).toFixed(2));
        } else if (operation === 'subtract') {
            // 检查余额是否足够
            if (Number((user.balance || 0)) < Number(amount)) {
                return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
            }
            user.balance = parseFloat((Number(user.balance || 0) - Number(amount)).toFixed(2));
        }

        // 保存更改
        await user.save();

        // 返回成功响应
        return NextResponse.json({ result: "success", balance: user.balance });
    } catch (error) {
        console.error("Error updating balance:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}