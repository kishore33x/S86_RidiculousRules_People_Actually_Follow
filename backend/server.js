const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

const entitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Entity = mongoose.model("Entity", entitySchema);

// Routes

// Get all entities or filter by user
app.get("/api/entities", async (req, res) => {
  try {
    const query = {};
    if (req.query.user_id) {
      query.created_by = req.query.user_id;
    }
    const entities = await Entity.find(query).populate("created_by");
    res.json(entities);
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

    const newEntity = new Entity({ title, description, category, created_by });
    await newEntity.save();
    res.status(201).json(newEntity);
  } catch (err) {
    res.status(500).json({ message: "Failed to add entity", error: err });
  }
});

// Delete an entity
app.delete("/api/entities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Entity.findByIdAndDelete(id);
    if (!deleted) {
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
    const updatedEntity = await Entity.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedEntity) {
      return res.status(404).json({ message: "Entity not found" });
    }
    res.json(updatedEntity);
  } catch (err) {
    res.status(500).json({ message: "Error updating entity", error: err });
  }
});

// Get all users (for dropdown)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
