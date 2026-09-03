import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const getAppBaseUrl = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is required for Better Auth.");
}

// Reuse the client through Next.js development reloads and retry transient
// writes that Atlas reports during a catalog update.
const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const client =
  globalForMongo.mongoClient ??
  new MongoClient(mongoUri, {
    retryWrites: true,
    maxPoolSize: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

// Use the same database as the Express backend instead of MongoDB's default
// "test" database.
const db = client.db(process.env.MONGODB_DB_NAME || "docappoint_db");

export const auth = betterAuth({
  baseURL: getAppBaseUrl(),
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),
  plugins: [jwt()],
  emailAndPassword: {
    enabled: true,
  },
});