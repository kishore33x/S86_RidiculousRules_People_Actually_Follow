const express = require('express');
const router = express.Router();
const User = require('./models/user');

// Fetch all users (GET)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to fetch users', details: error.message });
    }
});

// Create a new user (POST) with duplicate handling
router.post('/users', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ 
                error: '❌ User already exists', 
                details: existingUser.username === username ? 'Username is taken' : 'Email is already registered'
            });
        }

        const newUser = new User({ username, email, password, role });
        await newUser.save();
        res.status(201).json({ message: '✅ User created successfully!', user: newUser });
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to create user', details: error.message });
    }
});

// Seed Route (POST) - Adds sample user data
router.post('/seed', async (req, res) => {
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

module.exports = router;
