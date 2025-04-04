const mongoose = require('mongoose');

// Define the schema for the User
const userSchema = new mongoose.Schema({
    feed: String,
    quantity: String,
});

// Create the User model using the schema
const MortalityModel = mongoose.model('mortality', userSchema);

module.exports = MortalityModel;
