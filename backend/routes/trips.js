const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const auth = require('../middleware/auth');

// Get all trips for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new trip
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, startDate, endDate, isPublic } = req.body;
    
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: 'Title, start date, and end date are required' });
    }

    const newTrip = new Trip({
      user: req.user.id,
      title,
      description,
      startDate,
      endDate,
      isPublic
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
