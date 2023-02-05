const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  nom: { type: String},
  prenom: { type: String},
  mail: { type: String, required: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model('Message', messageSchema);