require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const routes = require('./routes'); // Import routes
const User = require(path.join(__dirname, 'models', 'user')); // Import User model

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Database Connection Status Variable
let dbStatus = "⏳ Connecting...";

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        dbStatus = "✅ Database connected";
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        dbStatus = "❌ Database connection failed";
    });

// Middleware
app.use(express.json());
app.use('/api', routes); // Use routes file

// Home Route - Displays Database Connection Status
app.get('/', (req, res) => {
    res.json({ message: dbStatus });
});

// Ping Route
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
