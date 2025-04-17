const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/Users");
const CustomerModel = require("./models/Customers");
const SupplierModel = require("./models/Supplier");
const BuyModel = require("./models/Buy");
const MortalityModel = require("./models/Mortality");
const BirdsModel = require("./models/Birds");
const FeedModel = require("./models/Feed");
const BhoosaModel = require("./models/Bhoosa");
const SellModel = require("./models/Sell");
const CfeedModel = require("./models/Cfeed");
const EmployeeModel = require("./models/Employee");
const FeedTypeModel = require("./models/FeedType");
const VaccineModel = require("./models/Vaccination");
const MedicationModel = require("./models/Medication");
const { default: axios } = require("axios");
const foodModel = require("./models/Food");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb+srv://Pratyush:Pratyush@cluster0.8udycfq.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Connection error:", err));

// Default route
app.get("/", (req, res) => {
  UserModel.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.get("/foodData", (req, res) => {
  foodModel.find()
    .then(data => res.json(data))
    .catch(err => res.status(500).json(err));
});
// Get user by ID
app.get("/getUser/:id", (req, res) => {
  const id = req.params.id;
  UserModel.findById({ _id: id })
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.get("/getCustomer", (req, res) => {
  CustomerModel.find({})
  .then((cust) => res.json(cust))
    .catch((err) => res.json(err));
});
app.get("/getSupplier", (req, res) => {
  SupplierModel.find({})
  .then((cust) => res.json(cust))
    .catch((err) => res.json(err));
});
app.get("/getbirds", (req, res) => {
  BirdsModel.find({})
  .then((cust) => res.json(cust))
    .catch((err) => res.json(err));
});

app.get("/getbhoosa", (req, res) => {
  BhoosaModel.find({})
  .then((cust) => res.json(cust))
    .catch((err) => res.json(err));
});
app.get("/getfeeds", (req, res) => {
  FeedModel.find({})
  .then((cust) => res.json(cust))
    .catch((err) => res.json(err));
});
app.get("/typefeeds", (req, res) => {
  FeedTypeModel.find({})
  .then((cust) => res.json(cust))
    .catch((err) => res.json(err));
});
app.get("/getmedicine", (req, res) => {
  MedicationModel.find({})
  .then((cust) => res.json(cust))
    .catch((err) => res.json(err));
});
app.get('/getempManage', async (req, res) => {
  try {
    const employees = await EmployeeModel.find(); // Adjust based on your DB structure
    res.json(employees);
  } catch (error) {
    res.status(500).send('Error retrieving employees');
  }
});

app.get("/getmotality", (req, res) => {
  MortalityModel.find({})
  .then((cust) => res.json(cust))
    .catch((err) => res.json(err));
});async function getLatestMonthTotal(model, quantityField, groupByField = null) {
  try {
    const latestEntry = await model.findOne().sort({ date: -1 }).select("date").lean();

    if (!latestEntry || !latestEntry.date) {
      return { month: null, totalQuantity: 0, groupedData: {} };
    }

    const latestMonth = latestEntry.date.substring(0, 7); // Extract YYYY-MM

    const aggregationPipeline = [
      {
        $match: {
          date: { $regex: `^${latestMonth}` }, // Matches all entries from the latest month
          ...(groupByField && { [groupByField]: { $ne: null, $ne: "" } }) // Ensure shed field is not null or empty
        }
      },
      {
        $addFields: {
          quantityInt: { 
            $convert: { input: `$${quantityField}`, to: "int", onError: 0, onNull: 0 } 
          } // Convert field to integer safely
        }
      }
    ];

    let totalQuantity = 0;
    let groupedData = {};

    if (groupByField) {
      aggregationPipeline.push({
        $group: {
          _id: `$${groupByField}`,
          totalQuantity: { $sum: "$quantityInt" } // Sum up the integer values per group
        }
      });

      const result = await model.aggregate(aggregationPipeline);
      result.forEach(entry => {
        groupedData[entry._id] = entry.totalQuantity;
        totalQuantity += entry.totalQuantity; // Sum up total quantity only for valid sheds
      });
    } else {
      const result = await model.aggregate(aggregationPipeline);
      totalQuantity = result.length ? result[0].totalQuantity : 0;
    }

    return {
      month: latestMonth,
      totalQuantity,
      groupedData
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { month: null, totalQuantity: 0, groupedData: {} };
  }
}

// API Route for `/birddetails`
app.get("/birddetails", async (req, res) => {
  try {
    const birdsData = await getLatestMonthTotal(BirdsModel, "quantity");
    const mortalityData = await getLatestMonthTotal(MortalityModel, "count", "shed");

    res.json({
      latestMonth: birdsData.month || mortalityData.month || "No Data",
      birdsTotalQuantity: birdsData.totalQuantity,
      mortalityTotalQuantity: mortalityData.totalQuantity,
      shedWiseMortality: mortalityData.groupedData // Adding shed-wise mortality count
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get('/totalbirds', async (req, res) => {
  try {
    const chicks = await BirdsModel.find();
    const mortalities = await MortalityModel.find();

    let total = 0;
    chicks.forEach(chick => {
      total += parseInt(chick.quantity || 0);
    });

    let totalMortality = 0;
    mortalities.forEach(m => {
      totalMortality += parseInt(m.count || 0);
    });

    const finalTotal = total - totalMortality;

    res.json({ totalBirds: finalTotal });
  } catch (error) {
    console.error('Error in /totalbirds:', error);
    res.status(500).json({ error: 'Failed to calculate total birds' });
  }
});



app.patch("/updateOrder/:id", async (req, res) => {
  try {
    await BuyModel.findByIdAndUpdate(req.params.id, { paymentStatus: req.body.paymentStatus });
    res.json({ message: "Payment status updated." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update payment status." });
  }
});
app.patch("/updateSell/:id", async (req, res) => {
  try {
    await BuyModel.findByIdAndUpdate(req.params.id, { paymentStatus: req.body.paymentStatus });
    res.json({ message: "Payment status updated." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update payment status." });
  }
});

// Delete user by ID
app.delete("/deleteCustomer/:id", (req, res) => {
  const id = req.params.id;
  CustomerModel.findByIdAndDelete({ _id: id })
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.delete("/deleteSupplier/:id", (req, res) => {
  const id = req.params.id;
  SupplierModel.findByIdAndDelete({ _id: id })
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});



// Create a new user
app.post("/createUser", (req, res) => {
  UserModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.post("/forder", (req, res) => {
  UserModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.post("/addCustomer", (req, res) => {
  CustomerModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

app.post("/food", (req, res) => {
  foodModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.post("/Cfeedtype", (req, res) => {
  FeedTypeModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.post("/empManage", (req, res) => {
  EmployeeModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.post("/addchicks", (req, res) => {
  BirdsModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.post("/addmortality", (req, res) => {
  MortalityModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.post("/addfeeds", (req, res) => {
  FeedModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.post("/addbhoosa", (req, res) => {
  BhoosaModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.post("/sell", (req, res) => {
  SellModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.get('/getCustomer/:id', async (req, res) => {
  try {
    const customer = await CustomerModel.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
});
app.get('/getSupplier/:id', async (req, res) => {
  try {
    const Supplier = await SupplierModel.findById(req.params.id);
    if (!Supplier) return res.status(404).json({ message: 'Customer not found' });
    res.json(Supplier);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
});
app.post("/addSupplier", (req, res) => {
  SupplierModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.post("/vaccination", (req, res) => {
  VaccineModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.post("/medication", (req, res) => {
  MedicationModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.post("/buy", (req, res) => {
  BuyModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.post("/Cfeed", (req, res) => {
  CfeedModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.get('/orders', (req, res) => {
  BuyModel.find()
    .then((orders) => res.json(orders))
    .catch((err) => res.status(500).json({ error: err.message }));
});
app.get('/sellOrder', (req, res) => {
  SellModel.find()
    .then((orders) => res.json(orders))
    .catch((err) => res.status(500).json({ error: err.message }));
});
app.get('/getCfeed', (req, res) => {
  CfeedModel.find()
    .then((orders) => res.json(orders))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
      const user = await UserModel.findOne({ name });

      if (!user) {
          return res.json({ success: false, message: "User not found" });
      }

      // If passwords are hashed, compare using bcrypt
      // const isMatch = await bcrypt.compare(password, user.password);
      const isMatch = user.password === password; // Use this if passwords are not hashed

      if (!isMatch) {
          return res.json({ success: false, message: "Invalid credentials" });
      }

      return res.json({ 
          success: true, 
          message: "Login successful", 
          user: { id: user._id, name: user.name } // Include _id
      });

  } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put('/updateCustomer/:id', async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error });
  }
});
app.delete('/deletefeedtype/:feedType', async (req, res) => {
  const feedTypeParam = req.params.feedType;

  try {
    const result = await CfeedModel.deleteOne({ 
      feedType: { $regex: new RegExp(`^${feedTypeParam}$`, 'i') } 
    });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Feed type deleted successfully' });
    } else {
      res.status(404).json({ message: 'Feed type not found' });
    }
  } catch (error) {
    console.error('Error deleting feed type:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/deleteCustomer/:id', async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
});
app.delete('/deleteSupplier/:id', async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
});
// Server listening
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

