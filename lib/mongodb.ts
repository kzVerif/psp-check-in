import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // ✅ โหลด .env ก่อนอ่าน DATABASE_URL

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error("⚠️ Missing environment variable: DATABASE_URL");
}

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGODB_URI);
  console.log("✅ MongoDB connected");
};
