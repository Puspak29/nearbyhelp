const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected successfully');
    }
    catch {
        console.error('MongoDB connection failed');
        process.exit(1);
    }
}

module.exports = connectDB;