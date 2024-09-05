const mongoose = require("mongoose");

const reportchannel = new mongoose.Schema({
  guildId: String,
  channelId: String,
});

const channel = mongoose.model("reportchannel", reportchannel);
module.exports = channel;
