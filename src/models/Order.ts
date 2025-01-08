import mongoose, { Schema, Document } from "mongoose";

interface IOrder extends Document {
    userId: string; // 用户 ID
    address: string;        // 用户支付地址
    amount: string;         // 支付金额
    status: "pending" | "success" | "failed" | "expired"; // 状态
    createdAt: Date;        // 创建时间
    expiresAt: Date;        // 过期时间
}

const OrderSchema = new Schema<IOrder>({
    userId: { type: String, required: true },
    address: { type: String, required: true },
    amount: { type: String, required: true },
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
});

export const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);