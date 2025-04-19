const mongoose = require("mongoose");

// Define the schema for the User
const userSchema = new mongoose.Schema({
    feedConsumed: String,
    waterConsumption: String,
    temperature: String,
    humidity: String,
    remarks: String,
    date: String
});

// Create the User model using the schema
const DataModel = mongoose.model("Birddata", userSchema);

module.exports = DataModel;
