const mongodbURI = 'mongodb://localhost:27017/wolke-next';
import { mongoose } from 'mongoose';
import { UserSchema, LogSchema } from '../model/schema.js';

main().catch(err => console.error(err));

async function main() {
    try {
        await mongoose.connect(mongodbURI);
        console.log('MongoDB connected successfully for log queries!');

        const User = mongoose.model('User', UserSchema);
        const Log = mongoose.model('Log', LogSchema);

        const userAlice = await User.findOne({ username: 'alice' });

        if (userAlice) {
            console.log(`\n--- Log Entries for ${userAlice.username} (ID: ${userAlice.id}) ---`);
            const aliceLogs = await Log.find({ user_id: userAlice.id });
            console.log(aliceLogs);

            console.log(`\n--- 'Created' Log Entries for ${userAlice.username} ---`);
            const createdLogsAlice = await Log.find({ user_id: userAlice.id, action: 'created' });
            console.log(createdLogsAlice);

            console.log(`\n--- Specific Log Entry (log10) for ${userAlice.username} ---`);
            const specificLog = await Log.findOne({ user_id: userAlice.id, id: 'log10' });
            console.log(specificLog);

        } else {
            console.log('User Alice not found. Cannot query her logs.');
        }

    } catch (err) {
        console.error('Error during log queries:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}
