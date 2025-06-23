
import mongoose from 'mongoose';
import { UserSchema, FileSchema, LogSchema } from '../../model/schema.js';

const mongodbURI = 'mongodb://localhost:27017/wolke-next';
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

async function seedDatabase() {
    try {
        await mongoose.connect(mongodbURI, mongooseOptions);
        console.log('MongoDB connected successfully for seeding!');

        const User = mongoose.model('User', UserSchema);
        const File = mongoose.model('File', FileSchema);
        const Log = mongoose.model('Log', LogSchema);

        console.log('Clearing existing collections...');
        await User.deleteMany({});
        await File.deleteMany({});
        await Log.deleteMany({});
        console.log('Existing collections cleared.');

        const usersData = [
            {
                "id": "user1",
                "username": "alice",
                "password": "securePass123",
                "email": "alice@example.com",
                "profile_pic_url": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
                "storage_amount": 1000
            }
        ];

        const filesData = [
            { "id": "file1", "user_id": "user1", "name": "Project Specs", "size": 2, "date": "2023-09-01", "changedate": "2023-09-15", "type": ".pdf" },
            { "id": "file2", "user_id": "user1", "name": "Meeting Notes", "size": 0.5, "date": "2023-09-05", "changedate": "2023-09-10", "type": ".txt" },
            { "id": "file3", "user_id": "user1", "name": "Research Paper", "size": 8, "date": "2023-09-10", "changedate": "2023-09-20", "type": ".docx" },
            { "id": "file4", "user_id": "user1", "name": "Expense Report", "size": 12, "date": "2023-09-14", "changedate": "2023-09-21", "type": ".pdf" },
            { "id": "file5", "user_id": "user1", "name": "Presentation", "size": 3, "date": "2023-09-08", "changedate": "2023-09-12", "type": ".ppt" }
        ];

        const logsData = [
            { "id": "log1", "user_id": "user1", "name": "report.docx", "action": "created", "date": "2025-05-11" },
            { "id": "log2", "user_id": "user1", "name": "invoice.pdf", "action": "changed", "date": "2025-05-10" },
            { "id": "log3", "user_id": "user1", "name": "logo.png", "action": "deleted", "date": "2025-05-09" },
            { "id": "log4", "user_id": "user1", "name": "project.zip", "action": "created", "date": "2025-05-08" },
            { "id": "log5", "user_id": "user1", "name": "slides.pptx", "action": "changed", "date": "2025-05-07" },
            { "id": "log6", "user_id": "user1", "name": "notes.txt", "action": "created", "date": "2025-05-06" },
            { "id": "log7", "user_id": "user1", "name": "backup.tar", "action": "deleted", "date": "2025-05-05" },
            { "id": "log8", "user_id": "user1", "name": "music.mp3", "action": "created", "date": "2025-05-04" },
            { "id": "log9", "user_id": "user1", "name": "summary.pdf", "action": "changed", "date": "2025-05-03" },
            { "id": "log10", "user_id": "user1", "name": "todo.md", "action": "deleted", "date": "2025-05-02" },
            { "id": "log11", "user_id": "user1", "name": "avatar.jpg", "action": "created", "date": "2025-05-01" },
            { "id": "log12", "user_id": "user1", "name": "data.csv", "action": "changed", "date": "2025-04-30" },
            { "id": "log13", "user_id": "user1", "name": "contract.pdf", "action": "deleted", "date": "2025-04-29" },
            { "id": "log14", "user_id": "user1", "name": "draft.doc", "action": "created", "date": "2025-04-28" },
            { "id": "log15", "user_id": "user1", "name": "resume.pdf", "action": "changed", "date": "2025-04-27" },
            { "id": "log16", "user_id": "user1", "name": "cover.jpg", "action": "deleted", "date": "2025-04-26" },
            { "id": "log17", "user_id": "user1", "name": "thesis.pdf", "action": "created", "date": "2025-04-25" },
            { "id": "log18", "user_id": "user1", "name": "diagram.svg", "action": "changed", "date": "2025-04-24" },
            { "id": "log19", "user_id": "user1", "name": "config.json", "action": "deleted", "date": "2025-04-23" },
            { "id": "log20", "user_id": "user1", "name": "api.js", "action": "created", "date": "2025-04-22" },
            { "id": "log21", "user_id": "user1", "name": "readme.md", "action": "changed", "date": "2025-04-21" },
            { "id": "log22", "user_id": "user1", "name": "banner.png", "action": "deleted", "date": "2025-04-20" },
            { "id": "log23", "user_id": "user1", "name": "plan.xlsx", "action": "created", "date": "2025-04-19" },
            { "id": "log24", "user_id": "user1", "name": "graph.xlsx", "action": "changed", "date": "2025-04-18" },
            { "id": "log25", "user_id": "user1", "name": "draft2.doc", "action": "deleted", "date": "2025-04-17" },
            { "id": "log26", "user_id": "user1", "name": "design.sketch", "action": "created", "date": "2025-04-16" },
            { "id": "log27", "user_id": "user1", "name": "index.html", "action": "changed", "date": "2025-04-15" },
            { "id": "log28", "user_id": "user1", "name": "app.js", "action": "deleted", "date": "2025-04-14" },
            { "id": "log29", "user_id": "user1", "name": "main.css", "action": "created", "date": "2025-04-13" },
            { "id": "log30", "user_id": "user1", "name": "photo.jpg", "action": "changed", "date": "2025-04-12" }
        ];

        await User.insertMany(usersData);
        await File.insertMany(filesData);
        await Log.insertMany(logsData);

        console.log("Database seeded with initial data!");

    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
    }
}

seedDatabase();
