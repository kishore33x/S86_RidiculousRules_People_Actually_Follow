const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rule: { type: mongoose.Schema.Types.ObjectId, ref: "Rule", required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Reviewed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", ReportSchema);
