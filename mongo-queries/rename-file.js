import { connectToDatabase } from './mongodb.js';
import { ObjectId } from 'mongodb';

export async function renameFile(fileId, newName) {
  const { db } = await connectToDatabase();
  const result = await db.collection('files').updateOne(
    { _id: new ObjectId(fileId) },
    { $set: { name: newName } }
  );
  return result;
}
