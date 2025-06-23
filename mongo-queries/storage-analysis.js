const mongodbURI = 'mongodb://localhost:27017/wolke-next';
import { mongoose } from 'mongoose';
import { UserSchema, FileSchema } from '../model/schema.js';

main().catch(err => console.error(err));

async function main() {
    try {
        await mongoose.connect(mongodbURI);
        console.log('MongoDB connected successfully for storage analysis!');

        const User = mongoose.model('User', UserSchema);
        const File = mongoose.model('File', FileSchema);

        const userAlice = await User.findOne({ username: 'alice' });

        if (userAlice) {
            console.log(`\n--- Storage Analysis for ${userAlice.username} ---`);
            const totalStorageAmount = userAlice.storage_amount;
            let usedStorageAmount = 0;
            const fileTypeAnalysis = {};

            const aliceFiles = await File.find({ user_id: userAlice.id });

            aliceFiles.forEach(file => {
                usedStorageAmount += file.size;

                if (!fileTypeAnalysis[file.type]) {
                    fileTypeAnalysis[file.type] = {
                        totalAmount: 0,
                        totalSize: 0,
                        totalPercentage: 0
                    };
                }
                fileTypeAnalysis[file.type].totalAmount++;
                fileTypeAnalysis[file.type].totalSize += file.size;
            });

            Object.keys(fileTypeAnalysis).forEach(type => {
                fileTypeAnalysis[type].totalPercentage = (
                    (fileTypeAnalysis[type].totalSize / totalStorageAmount) * 100
                ).toFixed(2);
            });

            console.log(`Total Storage: ${totalStorageAmount} MB`);
            console.log(`Used Storage: ${usedStorageAmount} MB`);
            console.log(`Percentage Used: ${((usedStorageAmount / totalStorageAmount) * 100).toFixed(2)} %`);
            console.log('Storage Analysis by File Type:', fileTypeAnalysis);

        } else {
            console.log('User Alice not found. Cannot perform storage analysis.');
        }

    } catch (err) {
        console.error('Error during storage analysis:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}
