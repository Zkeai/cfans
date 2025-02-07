import { NextResponse } from 'next/server';
import { GetBotStatus } from '@/service/telegrame';

export async function GET() {
    try {

        const res = await GetBotStatus();

        return res
    } catch (error) {
        console.error('❌ 处理 Webhook 请求时出错:', error);
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
    }
}