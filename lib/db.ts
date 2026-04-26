import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

const globalForMongoose = globalThis as {
    mongoose?: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
};

const cached = (globalForMongoose.mongoose ??= { conn: null, promise: null });

export default async function connectDB() {
    if (cached.conn) return cached.conn;
    cached.promise ??= mongoose.connect(MONGODB_URI!);
    cached.conn = await cached.promise;
    return cached.conn;
}

export function getDb() {
    if (!cached.conn) {
        throw new Error("No active MongoDB connection");
    }
    return mongoose.connection.db;
}
