const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON requests
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Server is running! Welcome to the API.');
});

// Health check route
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
