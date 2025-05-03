const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: "http://localhost:5173",
  credentials: true // allow frontend to send/receive cookies
}));

let db;

// MySQL Connection
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
    res.status(500).json({ message: "Error fetching users", error: err });
  }
});

// Get all entities or filter by user
app.get("/api/entities", async (req, res) => {
  try {
    const { user_id } = req.query;
    let query =
      "SELECT e.*, u.name as created_by_name FROM entities e JOIN users u ON e.created_by = u.id";
    const values = [];

    if (user_id) {
      query += " WHERE e.created_by = ?";
      values.push(user_id);
    }

    const [rows] = await db.query(query, values);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching entities", error: err });
  }
});

// Create a new entity
app.post("/api/entities", async (req, res) => {
  try {
    const { title, description, category, created_by } = req.body;
    if (!title || !description || !category || !created_by) {
      return res.status(400).json({ message: "All fields including created_by are required" });
    }

    const [result] = await db.query(
      "INSERT INTO entities (title, description, category, created_by) VALUES (?, ?, ?, ?)",
      [title, description, category, created_by]
    );

    res.status(201).json({ id: result.insertId, title, description, category, created_by });
  } catch (err) {
    res.status(500).json({ message: "Failed to add entity", error: err });
  }
});

// Delete an entity
app.delete("/api/entities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM entities WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entity not found" });
    }

    res.json({ message: "Entity deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting entity", error: err });
  }
});

// Update an entity
app.put("/api/entities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const [result] = await db.query(
      "UPDATE entities SET title = ?, description = ?, category = ? WHERE id = ?",
      [title, description, category, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entity not found" });
    }

    res.json({ message: "Entity updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating entity", error: err });
  }
});

// =================== AUTH ROUTES =================== //

// Login - Set username in cookie
app.post("/api/auth/login", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  res.cookie("username", username, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  res.json({ message: "Login successful", username });
});

// Logout - Clear cookie
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("username");
  res.json({ message: "Logout successful" });
});

// Check session
app.get("/api/auth/check", (req, res) => {
  const { username } = req.cookies;
  if (username) {
    res.json({ loggedIn: true, username });
  } else {
    res.json({ loggedIn: false });
  }
});

// =================== START SERVER =================== //

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
