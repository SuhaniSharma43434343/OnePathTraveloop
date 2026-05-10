const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  text: { type: String, required: true },
  isPacked: { type: Boolean, default: false },
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChecklistItem', checklistItemSchema);
