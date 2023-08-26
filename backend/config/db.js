import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    });
    // console.log(`MongoDb Connected: ${conn.connection.host}`);
  } catch (error) {
    // console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
