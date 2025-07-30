import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { UserSchema, FileSchema, LogSchema } from "../../model/schema.js";

let mongoServer;
let isConnectedToTestDB = false;

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const File = mongoose.models.File || mongoose.model('File', FileSchema);
const LogEntry = mongoose.models.LogEntry || mongoose.model('LogEntry', LogSchema);

export async function connectTestDb() {
    if (isConnectedToTestDB) {
        console.log("Already connected to test DB.");
        return mongoServer;
    }

    try {
      mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        process.env.MONGO_URI = mongoUri;

        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(mongoUri, { dbName: "testdb" });
        }

        isConnectedToTestDB = true;

        if (mongoose.connection?.readyState === 1) {
            await User.deleteMany({});
            await File.deleteMany({});
            await LogEntry.deleteMany({});
        }

        const testUser = await User.create({
            id: "testuser1",
            username: "testuser",
            password: "hashedpassword",
            email: "test@example.com",
            profile_pic_url: "http://example.com/pic.jpg",
            storage_amount: 1000
        });

        await File.create([
            {
                id: "testfile1",
                user_id: testUser.id,
                name: "document",
                size: 100,
                date: new Date("2024-01-01"),
                changedate: new Date("2024-01-01"),
                type: ".pdf"
            },
            {
                id: "testfile2",
                user_id: testUser.id,
                name: "image",
                size: 200,
                date: new Date("2024-01-02"),
                changedate: new Date("2024-01-02"),
                type: ".jpg"
            }
        ]);

        await LogEntry.create([
            {
                id: "log1",
                user_id: testUser.id,
                name: "document",
                action: "upload",
                date: new Date("2024-01-01T10:00:00Z")
            },
            {
                id: "log2",
                user_id: testUser.id,
                name: "image",
                action: "download",
                date: new Date("2024-01-02T11:00:00Z")
            }
        ]);
    } catch (error) {
        console.error("Error connecting to test DB:", error);
        throw new Error("Failed to connect to in-memory test database.");
    }

    return mongoServer;
}

export async function disconnectTestDb() {
    if (!isConnectedToTestDB) {
        console.log("No test DB connection to disconnect.");
        return;
    }
    try {
        await mongoose.disconnect();
        await mongoServer.stop();
        isConnectedToTestDB = false;
        console.log("Disconnected from test DB.");
    } catch (error) {
        console.error("Error disconnecting from test DB:", error);
    }
}

export { User, File, LogEntry };
