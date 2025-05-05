const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

let db;

// Connect to MySQL
async function connectToDB() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("✅ Connected to MySQL");
  } catch (err) {
    console.error("❌ MySQL connection error:", err);
    process.exit(1);
  }
}
connectToDB();

// =================== ROUTES =================== //

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// Get entities (optionally filtered by user_id)
app.get("/api/entities", async (req, res) => {
  try {
    const { user_id } = req.query;
    let query = `
      SELECT e.*, u.name as created_by_name 
      FROM entities e 
      JOIN users u ON e.created_by = u.id
    `;
    const params = [];

    if (user_id) {
      query += " WHERE e.created_by = ?";
      params.push(user_id);
    }

    const [entities] = await db.query(query, params);
    res.json(entities);
  } catch (err) {
    res.status(500).json({ message: "Error fetching entities", error: err.message });
  }
});

// Create entity
app.post("/api/entities", async (req, res) => {
  const { title, description, category, created_by } = req.body;
  if (!title || !description || !category || !created_by) {
    return res.status(400).json({ message: "All fields including created_by are required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO entities (title, description, category, created_by) VALUES (?, ?, ?, ?)",
      [title, description, category, created_by]
    );

    res.status(201).json({ id: result.insertId, title, description, category, created_by });
  } catch (err) {
    res.status(500).json({ message: "Failed to add entity", error: err.message });
  }
});

// Delete entity
app.delete("/api/entities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM entities WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entity not found" });
    }

    res.json({ message: "Entity deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting entity", error: err.message });
  }
});

// Update entity
app.put("/api/entities/:id", async (req, res) => {
  const { title, description, category } = req.body;
  const { id } = req.params;

  if (!title || !description || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE entities SET title = ?, description = ?, category = ? WHERE id = ?",
      [title, description, category, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entity not found" });
    }

    res.json({ message: "Entity updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating the entity", error: err.message });
  }
});

// =================== AUTH ROUTES =================== //

// Login - Set JWT cookie
app.post("/api/auth/login", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({ message: "Login successful", username });
});

// Logout - Clear cookie
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

// Check session
app.get("/api/auth/check", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ loggedIn: false });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.json({ loggedIn: false });
    res.json({ loggedIn: true, username: decoded.username });
  });
});

// =================== START SERVER =================== //

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
