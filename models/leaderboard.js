const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
  rule: { type: mongoose.Schema.Types.ObjectId, ref: "Rule", required: true },
  totalVotes: { type: Number, required: true }
});

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
