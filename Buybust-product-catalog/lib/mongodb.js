// lib/mongodb.js
import mongoose from "mongoose";

// Support BOTH env variable names to avoid mismatch
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("❌ Please define MONGO_URI or MONGODB_URI in .env.local");
}

// Global caching for hot reload
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "buybust", // your database name
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log("✅ Connected to MongoDB");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
