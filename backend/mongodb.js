require('dotenv').config();
const mongoose = require('mongoose');

const dbKey = process.env.DB_KEY;

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://admin-yuguwe:${dbKey}@yuguwedb.jmjrehd.mongodb.net/yuguweDB?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
};

module.exports = connectDB;
