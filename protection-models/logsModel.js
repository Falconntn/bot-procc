const mongoose = require("mongoose");

const logsSchema = new mongoose.Schema({
  channelId: String,
  guildId: String,
  type: String,
});

const logs = mongoose.model("logschannel", logsSchema);
module.exports = logs;
