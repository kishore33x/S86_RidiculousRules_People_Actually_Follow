const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Entity = require("./models/Entity");
const User = require("./models/User"); // ✅ Add this
const { body, validationResult } = require("express-validator");

// GET all entities
router.get("/entities", async (req, res) => {
  try {
    const entities = await Entity.find().populate("created_by"); // ✅ show user info
    res.json(entities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch entities" });
  }
});

// ✅ NEW: Get all users (for dropdown)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ NEW: Get entities by user
router.get("/entities/by-user/:userId", async (req, res) => {
  try {
    const entities = await Entity.find({ created_by: req.params.userId });
    res.json(entities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch entities by user" });
  }
});

// POST add new entity with validation
router.post(
  "/entities",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category").optional().notEmpty().withMessage("Category must not be empty if provided"),
    body("created_by").notEmpty().withMessage("created_by is required") // ✅ New validation
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, category, created_by } = req.body;

      // ✅ Optional: Verify the user exists
      const userExists = await User.findById(created_by);
      if (!userExists) {
        return res.status(400).json({ error: "User not found" });
      }

      const newEntity = new Entity({ name, description, category, created_by });
      await newEntity.save();
      res.status(201).json(newEntity);
    } catch (err) {
      res.status(500).json({ error: "Failed to add entity" });
    }
  }
);

// DELETE entity
router.delete("/entities/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid entity ID" });
  }

  try {
    const deletedEntity = await Entity.findByIdAndDelete(id);
    if (!deletedEntity) {
      return res.status(404).json({ error: "Entity not found" });
    }
    res.json({ message: "Entity deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete entity" });
  }
});

module.exports = router;
