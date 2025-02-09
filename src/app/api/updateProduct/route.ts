import { NextResponse } from 'next/server';
import { UpdateProduct } from '@/service/product';
import { IProduct } from "@/types/product"

export async function PUT(req: Request) {
    try {
        const col: IProduct = await req.json();

        // 处理 Telegram 更新
        const res = await UpdateProduct(col);

        return res
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}
