const mongoose = require('mongoose');

const entitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    created_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
});

const Entity = mongoose.model('Entity', entitySchema);
module.exports = Entity;
