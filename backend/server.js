// backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // => req.body ke liye zaroori

// Dummy resources
const resources = [
  { id: 1, title: "DSA Roadmap", link: "https://www.geeksforgeeks.org/dsa-roadmap/" },
  { id: 2, title: "System Design Basics", link: "https://www.educative.io/courses/grokking-the-system-design-interview" },
  { id: 3, title: "Top 100 Interview Questions", link: "https://leetcode.com" }
];

// Home route
app.get("/", (req, res) => {
  res.send("Backend ready 🚀");
});

// Resources route
app.get("/api/resources", (req, res) => {
  res.json(resources);
});

// --- Authentication (in-memory for Day 3 demo) ---
let users = []; // will reset on server restart (later we move to DB)

// Register route
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });

  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(400).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.json({ message: "User registered successfully ✅" });
});

// Login route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials ❌" });
  }

  // For now return a dummy token and username
  return res.json({ message: "Login successful ✅", token: "dummy-token", username });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
