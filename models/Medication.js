  const mongoose = require('mongoose');

  // Define the schema for Medicine Orders
  const medicineSchema = new mongoose.Schema({
    medicineName: String,
    quantity: Number,
    
    dosage: String,
    address: String,
    contact: String,
    paymentMethod:String,
    orderDate: Date, 
  });

  // Create the Medicine Model using the schema
  const MedicationModel = mongoose.model("medicine", medicineSchema);

  module.exports = MedicationModel;
