import { NextResponse } from 'next/server';
import { GetAllProduct } from '@/service/product';

export async function GET() {
    try {

        // 处理 Telegram 更新
        const res = await GetAllProduct();

        return res
    } catch (error) {
        return NextResponse.json({ ok: false, error: error }, { status: 500 });
    }
}