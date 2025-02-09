
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { IAuthUser } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const user: IAuthUser = await req.json()
    const { email, name, image, authProviderId } = user

    await connectDB();

    try {
        const alreadyUser = await User.findOne({ authProviderId });

        if (!alreadyUser) {
            await User.create({ email, name, image, authProviderId, balance: 0 });
            return NextResponse.json({ success: true }, { status: 200 });
        } else {

            return NextResponse.json({ success: true }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }

}
