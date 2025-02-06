import connectDB from "@/lib/db";
import { AdminDeleteUser } from "@/service/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    await connectDB()
    const { _id } = await req.json();

    try {

        const res = await AdminDeleteUser(_id)

        return NextResponse.json({ success: true, data: res.message }, { status: 200 });


    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}