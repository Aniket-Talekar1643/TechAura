import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB Connected Successfully");
    }
    catch (err) {
        console.log("MongoDB Connection Failed", err);
    }
}