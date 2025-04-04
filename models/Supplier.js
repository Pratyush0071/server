const mongoose = require('mongoose');

// Define the schema for the User
const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    company: String,
    address: String,
    product: String,
});

// Create the User model using the schema
const SupplierModel = mongoose.model('Supplier', userSchema);

module.exports = SupplierModel;
