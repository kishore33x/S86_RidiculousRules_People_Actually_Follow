const express = require('express');
const router = express.Router();

// Sample GET route
router.get('/resource', (req, res) => {
    res.json([{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]);
});

// Additional CRUD routes (example)
router.post('/resource', (req, res) => {
    const newItem = req.body;
    res.status(201).json({ message: "✅ Item Created", data: newItem });
});

router.put('/resource/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `✅ Item ${id} Updated`, data: req.body });
});

router.delete('/resource/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `✅ Item ${id} Deleted` });
});

module.exports = router;
