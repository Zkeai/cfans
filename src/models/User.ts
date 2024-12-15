import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    role: { type: String, default: 'user' },
    image: { type: String },
    authProviderId: { type: String },
    name: { type: String }
})

export const User = mongoose.models?.User || mongoose.model('User', userSchema);