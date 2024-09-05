const mongoose = require("mongoose");

const antispamSchema = new mongoose.Schema({
  guildId: String,
  onoff: String,
});

const antispam = mongoose.model("antispam", antispamSchema);
module.exports = antispam;
