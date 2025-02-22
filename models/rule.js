const mongoose = require("mongoose");

const RuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 }
});

module.exports = mongoose.model("Rule", RuleSchema);
