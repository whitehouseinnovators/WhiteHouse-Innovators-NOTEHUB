// server.js (Express 4 version)
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Parse JSON bodies
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "..", "Public")));

// Helper function to read users from CSV
function readUsers() {
  return new Promise((resolve) => {
    const users = [];
    if (!fs.existsSync("data.csv")) return resolve(users);

    fs.createReadStream("data.csv")
      .pipe(csv({ headers: ["id","name","email","password","course","semester"], skipLines: 0 }))
      .on("data", row => users.push(row))
      .on("end", () => resolve(users))
      .on("error", () => resolve(users));
  });
}

// --- Register ---
app.post("/register", async (req, res) => {
  const { name, email, password, course, semester } = req.body;
  if (!name || !email || !password || !course || !semester)
    return res.status(400).send("All fields required");

  const users = await readUsers();
  if (users.find(u => u.email === email)) return res.status(400).send("Email already registered");

  const line = `${Date.now()},${name},${email},${password},${course},${semester}\n`;
  fs.appendFileSync("data.csv", line, "utf8");
  res.send("Registered successfully!");
});

// --- Login ---
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send("Email and password required");

  const users = await readUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) res.json(user);
  else res.status(401).send("Invalid email or password");
});

// Fallback route to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Public", "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
