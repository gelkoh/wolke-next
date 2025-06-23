const mongodbURI = 'mongodb://localhost:27017/wolke-next';
import { mongoose } from 'mongoose';
import { FileSchema } from '../model/schema.js';

main().catch(err => console.error(err));

async function main() {
    try {
        await mongoose.connect(mongodbURI);
        console.log('MongoDB connected successfully for document creation!');

        const File = mongoose.model('File', FileSchema);

        console.log("\n--- Creating a new File ---");
        const newFile = new File({
            id: "file_new",
            user_id: "user1",
            name: "New Project Plan",
            size: 1.5,
            date: "2025-06-23",
            changedate: "2025-06-23",
            type: ".xlsx"
        });
        await newFile.save();
        console.log("New file saved successfully:", newFile);

        console.log("\n--- All Files after new creation ---");
        const allFiles = await File.find({ user_id: "user1" });
        console.log(allFiles);

    } catch (err) {
        console.error('Error during document creation:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}
