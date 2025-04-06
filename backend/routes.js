const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Entity = require("./models/Entity");

// GET all entities
router.get("/entities", async (req, res) => {
  try {
    const entities = await Entity.find();
    res.json(entities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch entities" });
  }
});

// POST add new entity
router.post("/entities", async (req, res) => {
  try {
    const { name, description } = req.body;
    const newEntity = new Entity({ name, description });
    await newEntity.save();
    res.status(201).json(newEntity);
  } catch (err) {
    res.status(500).json({ error: "Failed to add entity" });
  }
});

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
