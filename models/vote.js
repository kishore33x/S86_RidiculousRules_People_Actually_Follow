const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rule: { type: mongoose.Schema.Types.ObjectId, ref: "Rule", required: true },
  voteType: { type: String, enum: ["upvote", "downvote"], required: true }
});

module.exports = mongoose.model("Vote", VoteSchema);
