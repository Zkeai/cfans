import { NextResponse } from 'next/server';
import { SetBotStatus } from '@/service/telegrame';

export async function POST(req: Request) {
    try {
        const { status } = await req.json();
        //console.log('📩 收到消息:', update);

        // 处理 Telegram 更新
        const res = await SetBotStatus(status);

        return res
    } catch (error) {
        console.error('❌ 处理 Webhook 请求时出错:', error);
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
    }
}