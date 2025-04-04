const mongoose = require('mongoose');

// Define the schema for the User
const userSchema = new mongoose.Schema({
    name: String,
    type: String,
    password: String,
});

// Create the User model using the schema
const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
