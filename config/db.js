const mongoose = require("mongoose");
require("dotenv").config();

// Define the database connection URL
const dbURI = process.env.CLEARLINE_MONGO_URI;

// Define options for the database connection
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Create a function to connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, dbOptions);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

// Export the connectDB function
module.exports = connectDB;
