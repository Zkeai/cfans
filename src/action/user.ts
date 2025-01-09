'use server';

import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import { hash } from 'bcryptjs'
import { signIn } from "@/lib/auth";


const login = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        const response = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (response?.error) {

            return { success: false, error: response.error };
        }
    } catch (error: any) {


        return { success: false, message: error["cause"]?.err?.message };
    }
    redirect("/dashboard");
};

const register = async (formdata: FormData) => {
    const firstName = formdata.get("firstname") as string
    const lastName = formdata.get("lastname") as string
    const email = formdata.get("email") as string
    const password = formdata.get("password") as string


    if (!firstName || !lastName || !email || !password) {

        return { success: false, message: "Please fill all fields(请完整填写参数)" };
    }

    if (password.length < 8) {

        return { success: false, message: "Password must be more than 8 characters(密码最小8位)" };
    }
    if (password.length > 32) {

        return { success: false, message: "Password must be less than 32 characters(密码最大32位)" };
    }

    await connectDB();

    // existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return { success: false, message: "email already exists(邮箱已存在)" }

    const hashedPassword = await hash(password, 12)
    await User.create({ firstName, lastName, email, balance: 0, password: hashedPassword })

    redirect('/login')

}


export { register, login }
