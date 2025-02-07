import mongoose from "mongoose";

const telegrameSchema = new mongoose.Schema({
    admin: { type: Array<string>, default: [] },
    isOpen: { type: String, default: false }
})

export const Telegrame = mongoose.models?.Telegrame || mongoose.model('Telegrame', telegrameSchema);