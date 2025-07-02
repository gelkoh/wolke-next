import mongoose from "mongoose"
import { UserSchema } from "../../../../../model/schema.js"

const mongodbURI = 'mongodb://backend:27017/wolke-next'

let isConnected = false

async function connectDb() {
    if (isConnected) {
        console.log("Using existing database connection")
        return
    }

    try {
        await mongoose.connect(mongodbURI)
        isConnected = true
        console.log("MongoDB connected successfully")
    } catch(error) {
        console.error("MongoDB connection error: ", error)
        throw new Error("Failed to connect to database")
    }
}

const User = mongoose.models.User || mongoose.model("User", UserSchema)

export async function GET(request, { params }) {
    await connectDb()

    const { id } = params

    try {
        const user = await User.findOne({ id: id })

        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: { "Content-type": "application/json" }
            })
        }

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { "Content-type": "application/json" }
        })
    } catch(error) {
        console.error("Error fetching user: ", error)
        return new Response(JSON.stringify({
            message: "Internal Server Error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), {
            status: 500,
            headers: { "Content-type": "application/json"}
        })
    }
}
