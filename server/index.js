const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Create route path
app.get("/", (req, res) => {
    res.send("Welcome to the Bank API");
});

// Start the server
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});

// Connect to MongoDB
mongoose
    .connect("mongodb+srv://beski1234:beski1234@cluster0.5oryc.mongodb.net/bank", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// **🔹 Define the Schema**
const dataSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    amount: { type: Number, default: 1000 }, // Default balance is ₹1000
});

// **🔹 Create the Model**
let User = mongoose.model("tests", dataSchema);
 // ✅ Model was missing

// **🔹 API: Fetch All Users**
app.get("/data", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

// **🔹 API: Register New User**
app.post("/Create", async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});

// **🔹 API: Deposit Amount**
app.post("/deposit", async (req, res) => {
    const { name, email, password, amount } = req.body;

    try {
        // ✅ Find user by name, email, and password
        const user = await User.findOne({ name, email, password });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid user details!" });
        }

        // ✅ Add deposit amount
        user.amount += Number(amount);
        await user.save();

        res.json({ success: true, newBalance: user.amount });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error processing deposit", error });
    }
});


//cashback

app.post('/withdraw', async (req, res) => {
    const { name, email, password, amount } = req.body;
    try {
        const user = await User.findOne({ name, email, password });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid user details!" });
        }

        if (user.amount < amount) {
            return res.status(400).json({ success: false, message: "Insufficient balance!" });
        }

        user.amount -= Number(amount);
        await user.save();

        res.json({ success: true, newBalance: user.amount });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error processing withdrawal", error });
    }
});


//delte 
app.delete("/delete/:id", async (req, res) => {
    try {
        let deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }
        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting user", error });
    }
});


//update 

app.put('/update/:email', async (req, res) => {
    try {
        let updatedUser = await User.findOneAndUpdate(
            { email: req.params.email },
            req.body,
            { new: true }
        );
        res.json({ success: true, updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating user", error });
    }
});
