const mongoose = require('mongoose');

const antilinksSchema = new mongoose.Schema({
    guildId: String,
    onoff: String,
  });


  const Antilinks = mongoose.model('Antilinks', antilinksSchema);
  module.exports = Antilinks;
