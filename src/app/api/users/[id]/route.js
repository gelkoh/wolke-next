import mongoose from "mongoose";
import { UserSchema } from "../../../../../model/schema.js";

const mongodbURI = process.env.MONGO_URI || "mongodb://backend:27017/wolke-next";

async function connectDb() {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    try {
        await mongoose.connect(mongodbURI, {});
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection error: ", error);
        throw new Error("Failed to connect to database");
    }
}

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export async function GET(request, { params }) {
    try {
        await connectDb();
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Internal Server Error",
                error: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const { id } = params;

    try {
        const user = await User.findOne({ id });

        if (!user) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching user: ", error);
        return new Response(
            JSON.stringify({
                message: "Internal Server Error",
                error: error.message,
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
