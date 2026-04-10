import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

const globalForMongoose = globalThis as typeof globalThis & {
    mongoose?: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
};

const cached = (globalForMongoose.mongoose ??= { conn: null, promise: null });

const connectDB = async () => {
    if (cached.conn) return cached.conn;
    cached.promise ??= mongoose.connect(MONGODB_URI);
    cached.conn = await cached.promise;
    return cached.conn;
};

export default connectDB;

export const getDb = () => mongoose.connection.db;
