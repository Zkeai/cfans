import mongoose, { Schema, Document } from "mongoose";

interface IShopOrder extends Document {
    userId: string;
    url: string;
    amount: string;         // 支付金额
    num: number;
    server: string;
    status: "pending" | "success" | "stop" | "reimburse" | "aftersales"; // 状态
    createdAt: Date;        // 创建时间
}

const ShopOrderSchema = new Schema<IShopOrder>({
    userId: { type: String, required: true },
    url: { type: String, required: true },
    amount: { type: String, required: true },
    num: { type: Number, required: true },
    server: { type: String, required: true },
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now },

});

export const ShopOrder = mongoose.models.ShopOrder || mongoose.model<IShopOrder>("ShopOrder", ShopOrderSchema);