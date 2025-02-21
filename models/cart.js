const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', CartSchema);
