require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const User = require(path.join(__dirname, 'models', 'user')); // Import User model
const Entity = require(path.join(__dirname, 'models', 'entity')); // Import Entity model

const app = express();
const PORT = process.env.PORT || 5000; // Ensure it's 5000 for frontend integration
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for frontend integration

// Logging middleware (for debugging)
app.use((req, res, next) => {
    console.log(`📢 ${req.method} request to ${req.url}`);
    next();
});

// ========================== HOME ROUTE ==========================
app.get('/', (req, res) => {
    res.send('🚀 Server is running! Welcome to the API.');
});

// ========================== ENTITIES ROUTES ==========================
// Fetch all entities
app.get('/api/entities', async (req, res) => {
    try {
        const entities = await Entity.find();
        res.json(entities);
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to fetch entities', details: error.message });
    }
});

// Create a new entity
app.post('/api/entities', async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ error: '❌ Name and Description are required' });
        }
        const newEntity = new Entity({ name, description });
        await newEntity.save();
        res.status(201).json({ message: '✅ Entity created successfully!', entity: newEntity });
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to create entity', details: error.message });
    }
});

// Update an entity by ID
app.put('/api/entities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ error: '❌ Name and Description are required' });
        }
        const updatedEntity = await Entity.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedEntity) {
            return res.status(404).json({ error: '❌ Entity not found' });
        }
        res.json({ message: '✅ Entity updated successfully!', entity: updatedEntity });
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to update entity', details: error.message });
    }
});

// Delete an entity by ID
app.delete('/api/entities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEntity = await Entity.findByIdAndDelete(id);
        if (!deletedEntity) {
            return res.status(404).json({ error: '❌ Entity not found' });
        }
        res.json({ message: '✅ Entity deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to delete entity', details: error.message });
    }
});

// ========================== ERROR HANDLING ==========================
app.use((req, res) => {
    res.status(404).json({ error: '❌ Route not found' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
