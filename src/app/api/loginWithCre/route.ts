
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { IAuthUser } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const user: IAuthUser = await req.json()
    const { email } = user

    await connectDB();

    try {
        await connectDB();

        // Check if user exists
        const user = await User.findOne({ email }).select("+password +role");

        return NextResponse.json({ success: true, message: user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }

}
