import { NextResponse } from 'next/server';
import { AddProduct } from '@/service/product';

export async function POST(req: Request) {
    try {
        const { service, name, category, min, max, rate, context } = await req.json();
        if (!name || !rate || !category) {
            return NextResponse.json({ success: false, message: "参数错误" }, { status: 200 });
        }
        // 处理 Telegram 更新
        const res = await AddProduct(service, name, category, min, max, rate, context);

        return res
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}
