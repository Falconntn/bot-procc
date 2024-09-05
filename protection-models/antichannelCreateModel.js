const mongoose = require('mongoose');

const antichannelCreateSchema = new mongoose.Schema({
    guildId: String,
    onoff: String,
  });


  const AntichannelCreate = mongoose.model('AntichannelCreate', antichannelCreateSchema);
  module.exports = AntichannelCreate;
