import { NextResponse } from 'next/server';
import { AddBotAdmin } from '@/service/telegrame';

export async function POST(req: Request) {
    try {
        const { telegrameId, id } = await req.json();

        // 处理 Telegram 更新
        const res = await AddBotAdmin(telegrameId, id);

        return res
    } catch (error) {
        return NextResponse.json({ ok: false, error: error }, { status: 500 });
    }
}