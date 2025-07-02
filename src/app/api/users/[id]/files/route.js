const mongodbURI = 'mongodb://backend:27017/wolke-next';
import mongoose from "mongoose"
import { FileSchema } from '../../../../../../model/schema.js';

let isConnected = false

async function connectDb() {
    if (isConnected) {
        console.log("Using existing database connection") 
        return;
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

const FileModel = mongoose.models.File || mongoose.model("File", FileSchema);

export async function GET(request, context) {
    try {
        await connectDb(); 
        const { id: userId } = context.params;
        const files = await FileModel.find({ user_id: userId }); 
        return new Response(JSON.stringify(files), {
            status: 200,
            headers: { "Content-type": "application/json" }
        });
    } catch(error) {
        console.error("Error fetching user files: ", error);
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
            status: 500,
            headers: { "Content-type": "application/json"}
        });
    }
}
export async function POST(request, context) { 
    let body;
    try {
        await connectDb();
        const { id: userId } = context.params; 

        try {
            body = await request.json();
            console.log("Successfully parsed JSON body:", body);
        } catch (jsonParseError) {
            console.error("Error parsing request body as JSON:", jsonParseError);
            const rawBodyContent = await request.text();
            console.error("Raw body content that caused error:", rawBodyContent);
            return new Response(JSON.stringify({ 
                message: "Invalid request body. Expected JSON.", 
                error: jsonParseError.message,
                rawContent: rawBodyContent
            }), {
                status: 400,
                headers: { "Content-type": "application/json" }
            });
        }

        const { name, size, type } = body;

        if (!name || typeof size === 'undefined' || !type) {
            return new Response(JSON.stringify({ message: "Missing required file metadata (name, size, type)." }), {
                status: 400,
                headers: { "Content-type": "application/json" }
            });
        }

        const newFile = new FileModel({ 
            id: crypto.randomUUID(),
            user_id: userId,
            name: name,
            size: size,
            date: new Date().toISOString().split('T')[0], 
            changedate: new Date().toISOString().split('T')[0], 
            type: type,
        });

        await newFile.save(); 

        console.log(`File metadata for '${name}' saved for user '${userId}'.`);

         return new Response(JSON.stringify({ 
            message: `File '${name}' uploaded successfully!`, 
            file: newFile
        }), {
            status: 201,
            headers: { "Content-type": "application/json" }
        });

    } catch(error) {
        console.error("Unhandled error in POST /files:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
            status: 500,
            headers: { "Content-type": "application/json"}
        });
    }
}


export async function DELETE(request, context) {
    try {
        await connectDb();
        const { id: userId } = context.params;

        const { searchParams } = new URL(request.url);
        const fileIdToDelete = searchParams.get('fileId');

        if (!fileIdToDelete) {
            return new Response(JSON.stringify({ message: "Missing 'fileId' query parameter." }), {
                status: 400,
                headers: { "Content-type": "application/json" }
            });
        }

        const result = await FileModel.deleteOne({ id: fileIdToDelete, user_id: userId });

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ message: "File not found or not authorized to delete." }), {
                status: 404, 
                headers: { "Content-type": "application/json" }
            });
        }

        console.log(`File with ID '${fileIdToDelete}' deleted for user '${userId}'.`);

        return new Response(JSON.stringify({ message: `File with ID '${fileIdToDelete}' deleted successfully.` }), {
            status: 200, // OK
            headers: { "Content-type": "application/json" }
        });

    } catch(error) {
        console.error("Unhandled error in DELETE /files:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
            status: 500,
            headers: { "Content-type": "application/json"}
        });
    }
}


export async function PATCH(request, context) {
    let body;
    try {
        await connectDb();
        const { id: userId } = context.params;

        try {
            body = await request.json();
            console.log("Successfully parsed JSON body for PATCH:", body);
        } catch (jsonParseError) {
            console.error("Error parsing request body as JSON for PATCH:", jsonParseError);
            const rawBodyContent = await request.text();
            console.error("Raw body content that caused error:", rawBodyContent);
            return new Response(JSON.stringify({
                message: "Invalid request body. Expected JSON.",
                error: jsonParseError.message,
                rawContent: rawBodyContent
            }), {
                status: 400,
                headers: { "Content-type": "application/json" }
            });
        }

        const { fileId, newName } = body;

        if (!fileId || !newName || typeof newName !== 'string' || newName.trim() === '') {
            return new Response(JSON.stringify({ message: "Missing or invalid 'fileId' or 'newName' in request body." }), {
                status: 400,
                headers: { "Content-type": "application/json" }
            });
        }

        const updatedFile = await FileModel.findOneAndUpdate(
            { id: fileId, user_id: userId },
            { $set: { name: newName, changedate: new Date().toISOString().split('T')[0] } },
            { new: true }
        );

        if (!updatedFile) {
            return new Response(JSON.stringify({ message: "File not found for this user or file ID is incorrect." }), {
                status: 404,
                headers: { "Content-type": "application/json" }
            });
        }

        console.log(`File '${fileId}' renamed to '${newName}' for user '${userId}'.`);

        return new Response(JSON.stringify({
            message: `File '${fileId}' renamed successfully to '${newName}'.`,
            file: updatedFile
        }), {
            status: 200,
            headers: { "Content-type": "application/json" }
        });

    } catch (error) {
        console.error("Unhandled error in PATCH /files:", error);
        return new Response(JSON.stringify({
            message: "Internal Server Error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), {
            status: 500,
            headers: { "Content-type": "application/json" }
        });
    }
}
