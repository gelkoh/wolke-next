import mongoose from "mongoose";
import { LogSchema } from "../../../model/schema";

const mongodbURI = 'mongodb://backend:27017/wolke-next';

let isConnected = false;

async function connectDb() {
    if (isConnected) return;
    try {
        await mongoose.connect(mongodbURI);
        isConnected = true;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to database");
    }
}

const LogModel = mongoose.models.Log || mongoose.model("Log", LogSchema);

export async function GET(request, { params }) {
    try {
        await connectDb();
        const userId = params.id;

        const logs = await LogModel.find({ user_id: userId }).sort({ date: -1 });

        return new Response(JSON.stringify(logs), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error fetching logs:", error);
        return new Response(JSON.stringify({
            message: "Internal Server Error",
            error: error.message
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
