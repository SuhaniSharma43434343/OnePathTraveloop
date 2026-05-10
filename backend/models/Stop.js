const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  city: { type: String, required: true },
  country: { type: String },
  arrivalDate: { type: Date },
  departureDate: { type: Date },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stop', stopSchema);
