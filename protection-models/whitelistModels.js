const mongoose = require("mongoose");

const whitelistSchema = new mongoose.Schema({
  userId: String,
  guildId: String,
});

const whitelist = mongoose.model("whitelistUsers", whitelistSchema);
module.exports = whitelist;
