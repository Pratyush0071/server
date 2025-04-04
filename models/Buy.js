const mongoose = require("mongoose");

// Define the schema for the User
const userSchema = new mongoose.Schema({
  outlet: String,
  supplier: String,
  shed: String,
  section: String,
  item: String,
  quantity: String,
  rate: String,
  total: String,
  date: String,
  time: String,
});

// Create the User model using the schema
const BuyModel = mongoose.model("Buy", userSchema);

module.exports = BuyModel;
