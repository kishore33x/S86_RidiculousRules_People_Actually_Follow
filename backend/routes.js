const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Entity = require("./models/Entity");
const { body, validationResult } = require("express-validator");

// GET all entities
router.get("/entities", async (req, res) => {
  try {
    const entities = await Entity.find();
    res.json(entities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch entities" });
  }
});

// POST add new entity with validation
router.post(
  "/entities",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category").optional().notEmpty().withMessage("Category must not be empty if provided")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, category } = req.body;
      const newEntity = new Entity({ name, description, category });
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
