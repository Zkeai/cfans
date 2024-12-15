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
    } catch (error) {


        return { success: false, error: error };
    }
    redirect("/");
};

const register = async (formdata: FormData) => {
    const firstName = formdata.get("firstname") as string
    const lastName = formdata.get("lastname") as string
    const email = formdata.get("email") as string
    const password = formdata.get("password") as string

    if (!firstName || !lastName || !email || !password) {
        throw new Error("Please fill all fields")
    }

    await connectDB();

    // existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("use already exists");

    const hashedPassword = await hash(password, 12)
    await User.create({ firstName, lastName, email, password: hashedPassword })

    redirect('/login')

}

export { register, login }
