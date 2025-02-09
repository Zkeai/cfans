import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { IProduct } from "@/types/product";
import { NextResponse } from "next/server";

export async function AddProduct(product: IProduct) {
    const { service, name, category, min, max, rate, context } = product
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
        return NextResponse.json({ success: true, message: "删除成功", data: result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}
export async function UpdateProduct(product: IProduct) {
    const { _id, service, rate, min, max, context, name, category } = product;
    await connectDB();

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            _id, // 查找的 ID
            { service, rate, min, max, context, name, category }, // 更新的字段
            { new: true } // 返回更新后的文档
        );

        if (!updatedProduct) {
            return NextResponse.json({ success: false, message: "产品未找到" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "更新成功", data: updatedProduct });
    } catch (error) {
        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}