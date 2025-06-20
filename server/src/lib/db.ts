import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected");
    });

    const MONGO_URI = process.env.MONGODB_URI!;
    if (!MONGO_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(`${MONGO_URI}/q-chat`);
  } catch (error) {
    console.log("Error connecting database", error);
    process.exit(1);
  }
};
