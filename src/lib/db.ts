// src/lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("⚠️ MongoDB connection string is missing in .env.local");
}

export async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, { dbName: "emp" });
    console.log("🚀 Successfully connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit on failure
  }
}

// Optional: MongoDB Event Listeners for debugging
mongoose.connection.on("connected", () => console.log("🔗 MongoDB Connected"));
mongoose.connection.on("disconnected", () => console.log("❌ MongoDB Disconnected"));
mongoose.connection.on("error", (err) => console.error("⚠️ MongoDB Error:", err));
