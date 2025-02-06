import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";




export async function POST(req: NextRequest) {
    await connectDB()
    try {
        // 从请求体中解析参数
        const { userId } = await req.json();

        // 检查必需参数是否存在
        if (!userId) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // 判断 userId 类型
        let query;
        if (userId.length !== 24) {
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
        user.password = ""
        // 返回成功响应
        return NextResponse.json({ result: "success", userInfo: user });
    } catch (error) {
        console.error("Error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}