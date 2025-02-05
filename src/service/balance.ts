/* eslint-disable @typescript-eslint/no-unused-vars */
import connectDB from "@/lib/db";

import { User } from "@/models/User";
type IBalance = {
    operation: string,
    userId: string,
    balance: number
}
export async function SetBalance(data: IBalance) {
    const { userId, operation, balance } = data
    await connectDB()
    try {

        // 判断 userId 类型
        let query;
        if (userId.length !== 24) {
            // authProviderId 格式检查
            query = { authProviderId: userId };
        } else {
            // _id 格式检查
            query = { _id: userId };
        }

        // 查找用户
        const user = await User.findOne(query);

        if (!user) {
            return "用户不存在"
        }

        // 根据操作类型更新余额
        if (operation === '+') {
            user.balance = parseFloat((Number(user.balance || 0) + Number(balance)).toFixed(2));
        } else if (operation === '-') {
            // 检查余额是否足够
            if (Number((user.balance || 0)) < Number(balance)) {
                return "该用户余额不足"
            }
            user.balance = parseFloat((Number(user.balance || 0) - Number(balance)).toFixed(2));
        }

        // 保存更改
        await user.save();


    } catch (error) {
        return "修改失败"
    }
}

export async function Getbalance(userId: string) {
    await connectDB()
    try {

        // 判断 userId 类型
        let query;
        if (userId.length !== 24) {
            // authProviderId 格式检查
            query = { authProviderId: userId };
        } else {
            // _id 格式检查
            query = { _id: userId };
        }

        // 查找用户
        const user = await User.findOne(query);

        if (!user) {
            return "用户不存在"
        }



        return user.balance

    } catch (error) {
        return "修改失败"
    }
}