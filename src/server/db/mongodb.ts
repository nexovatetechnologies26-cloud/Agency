import "server-only";
import mongoose from "mongoose";

/**
 * One shared MongoDB Atlas connection per server instance.
 * The cache on `globalThis` survives hot reloads in dev and is reused
 * across invocations of the same serverless instance in production.
 */
type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalForMongo = globalThis as unknown as { _mongoose?: Cache };
const cache: Cache = globalForMongo._mongoose ?? { conn: null, promise: null };
globalForMongo._mongoose = cache;

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Add it to .env.local (see .env.example).");

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || "nexovate",
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5_000, // fail fast if Atlas is unreachable
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null; // allow a retry on the next request
    throw err;
  }
  return cache.conn;
}

/**
 * Runs `fn` inside a MongoDB transaction — all writes succeed or none do.
 * Requires a replica set (every MongoDB Atlas cluster, including the free tier, is one).
 */
export async function withTransaction<T>(fn: (session: mongoose.ClientSession) => Promise<T>): Promise<T> {
  const conn = await connectDB();
  const session = await conn.startSession();
  try {
    let result!: T;
    await session.withTransaction(async () => {
      result = await fn(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
}
