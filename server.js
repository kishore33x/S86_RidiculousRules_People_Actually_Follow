require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Payment = require(path.join(__dirname, 'models', 'payment'));

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

// Fetch all payments (GET)
app.get('/payments', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to fetch payments', details: error.message });
    }
});

// Seed Route (POST) - Deletes existing payments and inserts new ones
app.post('/seed', async (req, res) => {
    try {
        // Delete all existing payments before inserting new ones
        await Payment.deleteMany({});

        const samplePayments = [
            { order: new mongoose.Types.ObjectId(), amount: 100, method: 'credit card', status: 'completed' },
            { order: new mongoose.Types.ObjectId(), amount: 50, method: 'paypal', status: 'pending' }
        ];

        await Payment.insertMany(samplePayments);
        res.json({ message: '✅ Sample payments inserted successfully!' });
    } catch (error) {
        res.status(500).json({ error: '❌ Failed to insert sample payments', details: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
