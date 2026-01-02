const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost';

    if(!uri) {
        throw new Error('MongoDB URI must be provided');
    }

    await mongoose.connect(uri);
    console.log('MongoDB Connected');

}

module.exports = connectDB;