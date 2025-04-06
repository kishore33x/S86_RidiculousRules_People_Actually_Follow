const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

// Create User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
