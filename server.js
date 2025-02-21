require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require(path.join(__dirname, 'models', 'user')); // Import User model

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Server is running! Welcome to the API.');
});

app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// Fetch all users (GET)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to fetch users', details: error.message });
    }
});

// Create a new user (POST)
app.post('/users', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: '❌ Username already exists' });
        }

        const newUser = new User({ username, email, password, role });
        await newUser.save();
        res.status(201).json({ message: '✅ User created successfully!', user: newUser });
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to create user', details: error.message });
    }
});

// Seed Route (POST) - Adds sample user data
app.post('/seed', async (req, res) => {
    try {
        // Delete all existing users before inserting new ones
        await User.deleteMany({});

        const sampleUsers = [
            { username: 'john_doe', email: 'john.doe@example.com', password: 'password123', role: 'user' },
            { username: 'admin_user', email: 'admin@example.com', password: 'adminpassword', role: 'admin' }
        ];

        await User.insertMany(sampleUsers);
        res.json({ message: '✅ Sample users inserted successfully!' });
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to insert sample users', details: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
