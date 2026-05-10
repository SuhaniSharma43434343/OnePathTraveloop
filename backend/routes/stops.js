const express = require('express');
const router = express.Router();
const Stop = require('../models/Stop');
const auth = require('../middleware/auth');

// Get all stops for a trip
router.get('/trip/:tripId', auth, async (req, res) => {
  try {
    const stops = await Stop.find({ trip: req.params.tripId }).sort({ order: 1 });
    res.json(stops);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a stop
router.post('/', auth, async (req, res) => {
  try {
    const newStop = new Stop(req.body);
    const savedStop = await newStop.save();
    res.status(201).json(savedStop);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a stop (e.g., reorder)
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedStop = await Stop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStop);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
