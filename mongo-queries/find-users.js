const mongodbURI = 'mongodb://localhost:27017/wolke-next';
import { mongoose } from 'mongoose';
import { UserSchema } from '../model/schema.js';

main().catch(err => console.error(err));

async function main() {
    try {
        await mongoose.connect(mongodbURI);
        console.log('MongoDB connected successfully for user queries!');

        const User = mongoose.model('User', UserSchema);

        console.log("\n--- All Users ---");
        const allUsers = await User.find();
        console.log(allUsers);

        console.log("\n--- Find Specific User (Alice) ---");
        const userAlice = await User.findOne({ username: 'alice' });
        if (userAlice) {
            console.log('Found Alice:', userAlice);
        } else {
            console.log('User Alice not found.');
        }

    } catch (err) {
        console.error('Error during user queries:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}
