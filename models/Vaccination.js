const mongoose = require('mongoose');

// Define the schema for the User
const userSchema = new mongoose.Schema({
    age: String,
    name: String,
    quantity: String,
    dose: String,
    company: String,
    shed: String
});

// Create the User model using the schema
const VaccineModel = mongoose.model('vaccination', userSchema);

module.exports = VaccineModel;
