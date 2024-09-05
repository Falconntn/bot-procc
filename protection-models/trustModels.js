const mongoose = require("mongoose");

const trustSchema = new mongoose.Schema({
  userId: String,
  guildId: String,
});

const trust = mongoose.model("Trustusers", trustSchema);
module.exports = trust;
