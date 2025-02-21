const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rule: { type: mongoose.Schema.Types.ObjectId, ref: "Rule", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bookmark", bookmarkSchema);
