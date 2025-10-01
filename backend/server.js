// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --------------------
// MongoDB Connection
// --------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/jobprep", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --------------------
// User Schema
// --------------------
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

// --------------------
// Dummy Resources
// --------------------
const resources = [
  { id: 1, title: "DSA Roadmap", link: "https://www.geeksforgeeks.org/dsa-roadmap/" },
  { id: 2, title: "System Design Basics", link: "https://www.educative.io/courses/grokking-the-system-design-interview" },
  { id: 3, title: "Top 100 Interview Questions", link: "https://leetcode.com" }
];

// --------------------
// Routes
// --------------------

// Home route
app.get("/", (req, res) => {
  res.send("Backend ready 🚀");
});

// Resources route
app.get("/api/resources", (req, res) => {
  res.json(resources);
});

// --------------------
// Register
// --------------------
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "User already exists!" });

    const newUser = new User({ username, password });
    await newUser.save();

    res.json({ message: "User registered successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------
// Login
// --------------------
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password) return res.status(401).json({ message: "Invalid credentials ❌" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });

    res.json({
      token,
      username: user.username,
      message: "Login successful ✅"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------
// Start server
// --------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
