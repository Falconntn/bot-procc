const mongoose = require('mongoose');

const antibotsSchema = new mongoose.Schema({
    guildId: String,
    onoff: String,
  });


  const Antibots = mongoose.model('Antibots', antibotsSchema);
  module.exports = Antibots;
