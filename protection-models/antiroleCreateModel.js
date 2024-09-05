const mongoose = require("mongoose");

const antiroleCreateSchema = new mongoose.Schema({
  guildId: String,
  onoff: String,
});

const AntiroleCreate = mongoose.model("AntiroleCreate", antiroleCreateSchema);
module.exports = AntiroleCreate;
