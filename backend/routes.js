const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Entity = require("./models/Entity");
const User = require("./models/User");
const { body, validationResult } = require("express-validator");

// GET all entities
router.get("/entities", async (req, res) => {
  try {
    const entities = await Entity.find().populate("created_by"); // Populate the user info for each entity
    res.json(entities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch entities" });
  }
});

// NEW: Get all users (for dropdown)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);  // Return the list of users to populate the dropdown in the frontend
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// NEW: Get entities created by a specific user
router.get("/entities/by-user/:userId", async (req, res) => {
  try {
    const entities = await Entity.find({ created_by: req.params.userId }).populate("created_by");
    if (entities.length === 0) {
      return res.status(404).json({ message: "No entities found for this user" });
    }
    res.json(entities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch entities by user" });
  }
});

// POST: Add new entity with validation
router.post(
  "/entities",
  [
    body("title").notEmpty().withMessage("Title is required"),  // Changed to title based on your schema
    body("description").notEmpty().withMessage("Description is required"),
    body("category").optional().notEmpty().withMessage("Category must not be empty if provided"),
    body("created_by").notEmpty().withMessage("Created_by is required") // Ensure the user ID is provided
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, category, created_by } = req.body;

      // Optional: Verify the user exists
      const userExists = await User.findById(created_by);
      if (!userExists) {
        return res.status(400).json({ error: "User not found" });
      }

      const newEntity = new Entity({ title, description, category, created_by });
      await newEntity.save();
      res.status(201).json(newEntity);
    } catch (err) {
      res.status(500).json({ error: "Failed to add entity" });
    }
  }
);

// DELETE: Delete entity by ID
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
