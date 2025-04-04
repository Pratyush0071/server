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

// Use bcryptjs instead of bcrypt

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: '*',  // Allow all origins (or specify your client origin)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect('mongodb+srv://Pratyush:Pratyush@cluster0.8udycfq.mongodb.net/myDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Database connected'))
.catch((err) => console.error('Connection error:', err));

// Server setup
app.listen(3000, () => console.log('Server running on port 3000'));
// Default route
app.get("/", (req, res) => {
  UserModel.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
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
app.get("/getSuppliers", (req, res) => {
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
});
async function getLatestMonthTotal(model, quantityField) {
  try {
    const latestEntry = await model.findOne().sort({ date: -1 }).select("date").lean();

    if (!latestEntry || !latestEntry.date) {
      return { month: null, totalQuantity: 0 };
    }

    const latestMonth = latestEntry.date.substring(0, 7); // Extract YYYY-MM

    const result = await model.aggregate([
      {
        $match: {
          date: { $regex: `^${latestMonth}` } // Matches all entries from the latest month
        }
      },
      {
        $addFields: {
          quantityInt: { $convert: { input: `$${quantityField}`, to: "int", onError: 0, onNull: 0 } } // Convert field to integer safely
        }
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantityInt" } // Sum up the integer values
        }
      }
    ]);

    return { month: latestMonth, totalQuantity: result.length ? result[0].totalQuantity : 0 };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { month: null, totalQuantity: 0 };
  }
}

// API Route for `/birddetails`
app.get("/birddetails", async (req, res) => {
  try {
    const birdsData = await getLatestMonthTotal(BirdsModel, "quantity");
    const mortalityData = await getLatestMonthTotal(MortalityModel, "count");

    res.json({
      latestMonth: birdsData.month || mortalityData.month || "No Data",
      birdsTotalQuantity: birdsData.totalQuantity,
      mortalityTotalQuantity: mortalityData.totalQuantity
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/birddetails", async (req, res) => {
  try {
    const birdsData = await getLatestMonthTotal(BirdsModel, "quantity");
    const mortalityData = await getLatestMonthMortality(MortalityModel);

    res.json({
      latestMonth: mortalityData.month || birdsData.month || "No Data",
      birdsTotalQuantity: birdsData.totalQuantity,
      outletOneMortality: mortalityData.outletOneMortality,
      outletTwoMortality: mortalityData.outletTwoMortality
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete user by ID
app.delete("/deleteCustomer/:id", (req, res) => {
  const id = req.params.id;
  CustomerModel.findByIdAndDelete({ _id: id })
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

// Update user by ID
app.put("/updateCustomer/:id", (req, res) => {
  const id = req.params.id;
  CustomerModel.findByIdAndUpdate(
    { _id: id },
    {
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
    }
  )
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
app.post("/getCustomers", (req, res) => {
  CustomerModel.create(req.body)
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
app.post("/addSupplier", (req, res) => {
  SupplierModel.create(req.body)
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
app.get('/getCfeed', (req, res) => {
  CfeedModel.find()
    .then((orders) => res.json(orders))
    .catch((err) => res.status(500).json({ error: err.message }));
});

const bcrypt = require('bcrypt');


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

app.delete('/deleteCustomer/:id', async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
});
// Server listening
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
