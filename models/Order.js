const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  nom: { type: String, required: true},
  prenom: { type: String, required: true},
  mail: { type: String, required: true },
  lienConfig: { type: String, required: true },
  price: { type: Number, required: true },
  adress: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  promotion: { type: Boolean},
  instructions: { type: String },
});

module.exports = mongoose.model('Order', orderSchema);