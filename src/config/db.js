import mongoose from 'mongoose';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

export const connectDB = async (retries = MAX_RETRIES) => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);

    if (retries > 0) {
      console.log(`⏳ Retrying in ${RETRY_DELAY / 1000} seconds... (${retries} retries left)`);
      setTimeout(() => connectDB(retries - 1), RETRY_DELAY);
    } else {
      console.error('❌ Max retries reached. Exiting...');
      process.exit(1);
    }
  }
};
