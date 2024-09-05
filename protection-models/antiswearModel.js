const mongoose = require("mongoose");

const antiswearSchema = new mongoose.Schema({
  guildId: String,
  onoff: String,
  words: [String], // Array of strings
});

const antiswear = mongoose.model("antiswear", antiswearSchema);
module.exports = antiswear;
