const mongoose = require("mongoose");

// Define the schema for the User
const userSchema = new mongoose.Schema({
  feedType: String,
  count: String,
  date: String
});

// Create the User model using the schema
const CfeedModel = mongoose.model("Cfeed", userSchema);

module.exports = CfeedModel;
