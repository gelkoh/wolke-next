import mongoose from 'mongoose';
import { FileSchema, UserSchema } from '../../../../../../model/schema.js'

const mongodbURI = 'mongodb://backend:27017/wolke-next';

let isConnected = false;

async function connectDb() {
    if (isConnected) {
        console.log('Using existing DB connection for files API');
        return;
    }
    try {
        await mongoose.connect(mongodbURI);
        isConnected = true;
        console.log('MongoDB connected successfully for files API!');
    } catch (error) {
        console.error('MongoDB connection error for files API:', error);
        throw new Error('Failed to connect to database for files API');
    }
}

const File = mongoose.models.File || mongoose.model('File', FileSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export async function GET(request, { params }) {
    await connectDb();

    const { id: userIdFromUrl } = params; 

    try {
        const existingUser = await User.findOne({ id: userIdFromUrl });

        if (!existingUser) {
            return new Response(JSON.stringify({ message: `User with ID '${userIdFromUrl}' not found.` }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const files = await File.find({ user_id: userIdFromUrl }); 

        return new Response(JSON.stringify(files), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching files:', error);
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

export async function POST(request, { params }) {
    await connectDb();

    const { id: userIdFromUrl } = params;

    try {
        const existingUser = await User.findOne({ id: userIdFromUrl });
        if (!existingUser) {
            return new Response(JSON.stringify({ message: `User with ID '${userIdFromUrl}' not found.` }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const body = await request.json(); // Liest den Request-Body als JSON

        const { id: fileIdFromBody, name, size, date, changedate, type } = body;

        if (!fileIdFromBody || !name || typeof size !== 'number' || !date || !changedate || !type) {
            return new Response(JSON.stringify({ message: 'Missing or invalid required file data in request body.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const newFile = new File({
            id: fileIdFromBody,
            user_id: userIdFromUrl,
            name,
            size,
            date,
            changedate,
            type,
        });

        await newFile.save();

        return new Response(JSON.stringify({ message: 'File created successfully', file: newFile }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
                'Location': `/api/users/${userIdFromUrl}/files/${newFile.id}` 
            },
        });
    } catch (error) {
        console.error('Error creating file:', error);
        if (error.code === 11000) {
            return new Response(JSON.stringify({ message: `File with ID '${body.id}' already exists for user '${userIdFromUrl}'.`, error: error.message }), {
                status: 409,
                headers: { 'Content-Type': 'application/json' },
            });
        }
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
