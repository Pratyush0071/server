const mongoose = require('mongoose');

// Define the schema for the User
const userSchema = new mongoose.Schema({
    employeeName: String,
        dailyEarnings: String,
        advancePayment: String,
        workingDays: String,
        leaves: String,
        totalPaid: String,
        extraPay: String,
});

// Create the User model using the schema
const EmployeeModel = mongoose.model('EmpData', userSchema);

module.exports = EmployeeModel;
 