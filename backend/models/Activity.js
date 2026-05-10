const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  stop: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['sightseeing', 'food', 'adventure', 'transport', 'stay', 'other'], default: 'other' },
  cost: { type: Number, default: 0 },
  startTime: { type: Date },
  endTime: { type: Date },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
