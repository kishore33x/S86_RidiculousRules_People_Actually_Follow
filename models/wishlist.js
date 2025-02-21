const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rule" }]
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
