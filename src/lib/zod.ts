import { object, string } from "zod"

export const signInSchema = object({
    email: string({ required_error: "Email is required(电子邮件为必填项)" })
        .min(1, "Email is required(电子邮件为必填项)")
        .email("Invalid email(邮箱错误)"),
    password: string({ required_error: "Password is required(密码为必填项)" })
        .min(1, "Password is required(密码为必填项)")
        .min(8, "Password must be more than 8 characters(密码最小8位)")
        .max(32, "Password must be less than 32 characters(密码最大32位)"),
})