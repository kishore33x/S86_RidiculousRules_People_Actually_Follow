const mongoose = require('mongoose');

const entitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
});

const Entity = mongoose.model('Entity', entitySchema);
module.exports = Entity;
