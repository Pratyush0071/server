const mongoose = require("mongoose");

// Define the schema for the User
const userSchema = new mongoose.Schema({
  outlet: String,
  customer: String,
  shed: String,
  section: String,
  quantity: String,
  weight: String,
  rate: String,
  total: String,
  date: String,
  time: String,
});

// Create the User model using the schema
const SellModel = mongoose.model("Sell", userSchema);

module.exports = SellModel;
