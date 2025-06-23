import { Schema } from "mongoose";

export const UserSchema = Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profile_pic_url: {
        type: String,
        required: true
    },
    storage_amount: {
        type: Number,
        required: true
    },
})

export const FileSchema = Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    changedate: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

export const LogSchema = Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})
