const mongoose = require('mongoose');

// Define the schema for the User
const userSchema = new mongoose.Schema({
    feedType: String
});

// Create the User model using the schema
const FeedTypeModel = mongoose.model('feedtype', userSchema);

module.exports = FeedTypeModel;
 
