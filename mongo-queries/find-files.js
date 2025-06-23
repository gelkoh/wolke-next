const mongodbURI = 'mongodb://localhost:27017/wolke-next';
import { mongoose } from 'mongoose';
import { UserSchema, FileSchema } from '../model/schema.js';

main().catch(err => console.error(err));

async function main() {
    try {
        await mongoose.connect(mongodbURI);
        console.log('MongoDB connected successfully for file queries!');

        const User = mongoose.model('User', UserSchema);
        const File = mongoose.model('File', FileSchema);

        const userAlice = await User.findOne({ username: 'alice' });

        if (userAlice) {
            console.log(`\n--- Files for ${userAlice.username} (ID: ${userAlice.id}) ---`);
            const aliceFiles = await File.find({ user_id: userAlice.id });
            console.log(aliceFiles);

            console.log(`\n--- PDF Files for ${userAlice.username} ---`);
            const alicePdfs = await File.find({ user_id: userAlice.id, type: '.pdf' });
            console.log(alicePdfs);

            console.log(`\n--- Files for ${userAlice.username} larger than 5 MB ---`);
            const largeAliceFiles = await File.find({ user_id: userAlice.id, size: { $gt: 5 } });
            console.log(largeAliceFiles);

        } else {
            console.log('User Alice not found. Cannot query her files.');
        }

    } catch (err) {
        console.error('Error during file queries:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}
