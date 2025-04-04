const mongoose = require('mongoose');

// Define the schema for the User
const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    type: String,
});

// Create the User model using the schema
const CustomerModel = mongoose.model('Customers', userSchema);

module.exports = CustomerModel;
