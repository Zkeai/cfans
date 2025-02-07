import connectDB from "@/lib/db";
import { ShopOrder } from "@/models/ShopOrder";
import mongoose from "mongoose";
export async function SearchShopOrder(orderId: string) {
    await connectDB()
    const shopOrder = await ShopOrder.findById(orderId)
    if (!shopOrder) {
        return false
    }
    return true
}

export async function SetShopOrderStatus(orderId: string, status: string) {
    await connectDB()

    const objectId = new mongoose.Types.ObjectId(orderId);
    const shopOrder = await ShopOrder.findById(objectId)

    shopOrder.status = status
    shopOrder.save()
}
