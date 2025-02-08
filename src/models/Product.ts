import mongoose, { Schema, Document } from "mongoose";


interface IProduct extends Document {
    service: string;
    name: string;
    category: string;
    min: number
    max: number
    rate: number;
    context: string;
}
const ProductSchema = new Schema<IProduct>({
    service: { type: String, required: true },
    name: { type: String, required: true },
    min: { type: Number, required: true, default: 1 },
    max: { type: Number, required: true, default: 999999 },
    category: { type: String, required: true },
    rate: { type: Number, required: true },
    context: { type: String },
});

export const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);