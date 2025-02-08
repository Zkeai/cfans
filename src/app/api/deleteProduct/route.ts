import { NextResponse } from 'next/server';
import { DeleteProduct } from '@/service/product';

export async function POST(req: Request) {
    try {
        const { id } = await req.json();

        // 处理 Telegram 更新
        const res = await DeleteProduct(id);

        return res
    } catch (error) {
        return NextResponse.json({ ok: false, error: error }, { status: 500 });
    }
}
