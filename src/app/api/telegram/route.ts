import { NextResponse } from 'next/server';
import { handleUpdate, setupWebhook } from '@/lib/telegram';

export async function POST(req: Request) {
    try {
        const update = await req.json();
        //console.log('📩 收到消息:', update);

        // 处理 Telegram 更新
        await handleUpdate(update);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('❌ 处理 Webhook 请求时出错:', error);
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await setupWebhook(process.env.WEBHOOK_URL!)
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
    }
}