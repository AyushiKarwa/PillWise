import mongoose from 'mongoose';

let isMongoConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️ MONGODB_URI not set. Using built-in persistent storage engine.');
    return false;
  }

  try {
    // Set low timeout so if local mongo isn't running it quickly falls back
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB successfully.');
    return true;
  } catch (error) {
    console.warn('⚠️ MongoDB connection deferred/failed. Falling back to built-in JSON storage engine.');
    isMongoConnected = false;
    return false;
  }
}

export function getIsMongoConnected() {
  return isMongoConnected;
}
