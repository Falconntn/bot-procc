const mongoose = require("mongoose");

const antiroleDeleteSchema = new mongoose.Schema({
  guildId: String,
  onoff: String,
});

const AntiroleDelete = mongoose.model("AntiroleDelete", antiroleDeleteSchema);
module.exports = AntiroleDelete;
