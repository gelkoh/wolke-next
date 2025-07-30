import { connectToDatabase } from './mongodb.js';
import { ObjectId } from 'mongodb';

export async function deleteFileById(fileId) {
  const { db } = await connectToDatabase();
  const result = await db.collection('files').deleteOne({ _id: new ObjectId(fileId) });
  return result;
}
