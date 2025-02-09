import { NextResponse } from 'next/server';
import { AddProduct } from '@/service/product';
import { IProduct } from '@/types/product';

export async function POST(req: Request) {
    try {
        const product: IProduct = await req.json();
        if (!product.name || !product.rate || !product.category) {
            return NextResponse.json({ success: false, message: "参数错误" }, { status: 200 });
        }
        // 处理 Telegram 更新
        const res = await AddProduct(product);

        return res
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}
