import connectDB from "@/lib/db";
import { GetUsers } from "@/service/user";
import { NextResponse } from "next/server";

export async function POST() {
    await connectDB()

    try {

        const userList = await GetUsers()

        return NextResponse.json({ data: userList }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}