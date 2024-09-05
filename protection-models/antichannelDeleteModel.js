const mongoose = require('mongoose');

const antichannelDeleteSchema = new mongoose.Schema({
    guildId: String,
    onoff: String,
  });


  const AntichannelDelete = mongoose.model('AntichannelDelete', antichannelDeleteSchema);
  module.exports = AntichannelDelete;
