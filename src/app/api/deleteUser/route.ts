import connectDB from "@/lib/db";
import { AdminDeleteUser } from "@/service/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    await connectDB()
    const { _id } = await req.json();

    try {

        const res = await AdminDeleteUser(_id)

        return res


    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}