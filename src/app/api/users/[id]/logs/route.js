import mongoose from 'mongoose';
import { UserSchema, LogSchema } from "../../../../../../model/schema.js"

const mongodbURI = 'mongodb://backend:27017/wolke-next';

let isConnected = false;

async function connectDb() {
    if (isConnected) {
        console.log('Using existing DB connection for logs API');
        return;
    }
    try {
        await mongoose.connect(mongodbURI);
        isConnected = true;
        console.log('MongoDB connected successfully for logs API!');
    } catch (error) {
        console.error('MongoDB connection error for logs API:', error);
        throw new Error('Failed to connect to database for logs API');
    }
}

// Modelle global definieren, um OverwriteModelError zu vermeiden
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const LogEntry = mongoose.models.LogEntry || mongoose.model("LogEntry", LogSchema);

export async function GET(request, { params }) {
    await connectDb();

    // **Korrektur hier:** Direkter Zugriff auf `params.id` in einer separaten Zeile
    // anstatt in der Destrukturierung der Funktionsargumente.
    const userIdFromUrl = params.id; 

    try {
        const existingUser = await User.findOne({ id: userIdFromUrl });
        console.log(existingUser); // Debugging-Ausgabe

        if (!existingUser) {
            return new Response(JSON.stringify({ message: `User with ID '${userIdFromUrl}' not found.` }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const logs = await LogEntry.find({ user_id: userIdFromUrl }).sort({ date: -1 });

        return new Response(JSON.stringify(logs), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        return new Response(JSON.stringify({
            message: 'Internal Server Error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
