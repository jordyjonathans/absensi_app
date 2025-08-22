import mongoose from "mongoose";
import { env } from "src/env";

const MONGO_URI = `mongodb://${env().MONGO_HOST}:${env().MONGO_PORT}/${
  env().MONGO_DATABASE
}`;

export const connectMongoDB = async (): Promise<typeof mongoose> => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB is already connected");
      return mongoose;
    }

    await mongoose.connect(MONGO_URI, {
      dbName: env().MONGO_DATABASE!,
    });

    console.log("✅ Connected to MongoDB");
    return mongoose;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
