const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  userId: String,
  guildId: String,
});

const Blacklist = mongoose.model("Blacklist", blacklistSchema);
module.exports = Blacklist;
