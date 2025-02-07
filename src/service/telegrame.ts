import connectDB from "@/lib/db";
import { ObjectId } from "mongodb";

import { Telegrame } from "@/models/Telegrame";
import { NextResponse } from "next/server";
export async function SetBotStatus(status: boolean) {
    try {
        // 连接数据库
        await connectDB();

        // 查询数据库中的记录
        const havetg = await Telegrame.find().lean(); // 使用 await 获取查询结果

        if (!havetg || havetg.length === 0) {
            // 如果没有记录，创建一个新的记录
            const telegrame = await Telegrame.create({ isOpen: status });
            if (!telegrame) {
                return NextResponse.json({ result: "订单失败" }, { status: 200 });
            }
            return NextResponse.json({ result: "创建成功", data: telegrame }, { status: 200 });
        } else {
            // 如果记录已存在，更新状态
            const updatedTelegrame = await Telegrame.updateOne(
                {}, // 无条件更新第一条记录
                { $set: { isOpen: status } }
            );

            if (updatedTelegrame.modifiedCount === 0) {
                return NextResponse.json({ result: "状态未更改" }, { status: 200 });
            }

            return NextResponse.json({ result: "更新成功", data: { isOpen: status } }, { status: 200 });
        }

    } catch (error) {
        // 捕获并返回错误信息

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}
export async function GetBotStatus() {
    try {
        await connectDB();
        const havetg = await Telegrame.find().lean();
        return NextResponse.json({ result: "查询成功", data: havetg }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}
export async function AddBotAdmin(id: string, tgId: string) {
    await connectDB()
    try {
        const result = await Telegrame.updateOne(
            { _id: new ObjectId(id) },
            { $addToSet: { admin: tgId } }
        );
        return NextResponse.json({ result: "添加成功", data: result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}

export async function RemoveAdmin(id: string, tgId: string) {
    await connectDB()
    try {
        const result = await Telegrame.updateOne(
            { _id: new ObjectId(id) },
            { $pull: { admin: tgId } }
        );
        return NextResponse.json({ result: "删除成功", data: result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }



}