const mongoose = require("mongoose");

// Define the schema for the User
const userSchema = new mongoose.Schema({
  quantity: String,
  date: String,
  time: String,
  shed: String
});

// Create the User model using the schema
const FeedModel = mongoose.model("Feed", userSchema);

module.exports = FeedModel;
