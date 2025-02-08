/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { handleUpdate, setupWebhook } from '@/lib/telegram';

export async function POST(req: Request) {
    try {
        const update = await req.json();

        await handleUpdate(update);

        return NextResponse.json({ ok: true });
    } catch (error) {

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