const express = require("express");
const cors = require("cors");   // ✅ ye nayi line add karni hai

const app = express();
const PORT = 5000;

// ✅ CORS ko enable karna hai
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend ready 🚀");
});

app.get("/api/resources", (req, res) => {
  res.json([
    { id: 1, title: "DSA Roadmap", link: "https://example.com/dsa" },
    { id: 2, title: "System Design", link: "https://example.com/system-design" },
    { id: 3, title: "Leetcode", link: "https://leetcode.com" }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
