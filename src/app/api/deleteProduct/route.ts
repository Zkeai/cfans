import { NextResponse } from 'next/server';
import { DeleteProduct } from '@/service/product';

export async function DELETE(req: Request) {
    try {
        const col = await req.json();

        // 处理 Telegram 更新
        const res = await DeleteProduct(col);

        return res
    } catch (error) {
        return NextResponse.json({ ok: false, error: error }, { status: 500 });
    }
}
