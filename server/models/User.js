import mongoose from "mongoose";
import mogoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        default: "https://images.unsplash.com/photo-1544502062-f82887f03d1c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1559&q=80",
    },
    subscribers: {
        type: Number,
        default: 0,
    },
    subscribedUsers: {
        type:[String]
    },
    fromGoogle: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true}
);

export default mongoose.model("User", UserSchema);