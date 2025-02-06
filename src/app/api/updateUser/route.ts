import connectDB from "@/lib/db";
import { AdminSetRole, AdminSetBalance } from "@/service/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    await connectDB()
    const { id, field, value } = await req.json();

    try {
        if (field === "role") {
            await AdminSetRole(id, value)

        } else {
            await AdminSetBalance(id, value)

        }

        return NextResponse.json({ success: true }, { status: 200 });


    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}