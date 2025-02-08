import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function AddProduct(service: string, name: string, category: string, min: number, max: number, rate: number, context: string) {
    await connectDB()
    try {
        const haveProduct = await Product.findOne({ name: name })
        if (!haveProduct) {
            const product = await Product.create({ service, name, category, min, max, rate, context })
            if (product) {
                return NextResponse.json({ success: true, message: "添加商品成功" }, { status: 200 });
            } else {
                return NextResponse.json({ success: false, message: "添加商品失败" }, { status: 200 });
            }

        } else {
            return NextResponse.json({ success: false, message: "已存在同名商品" }, { status: 200 });
        }


    } catch (error) {
        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }

}

export async function GetAllProduct() {
    try {
        await connectDB();
        const havePg = await Product.find().lean();
        return NextResponse.json({ success: true, message: havePg }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}

export async function DeleteProduct(id: string) {
    await connectDB()
    try {
        const result = await Product.findByIdAndDelete(id)
        return NextResponse.json({ result: "删除成功", data: result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}