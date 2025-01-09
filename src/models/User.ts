import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String, default: 'user' },
    image: { type: String || undefined },
    authProviderId: { type: String, unique: true },
    name: { type: String },
    balance: { type: Number }
})

export const User = mongoose.models?.User || mongoose.model('User', userSchema);