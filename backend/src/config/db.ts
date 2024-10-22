import mongoose from 'mongoose';

// This function connects to MongoDB using the URI from the environment variables
const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1); 
  }
};

export default connectDB;
