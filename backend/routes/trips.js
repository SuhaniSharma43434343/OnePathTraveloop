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
    console.error('Get trips error:', err);
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
});

// Create a new trip
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, startDate, endDate, isPublic } = req.body;

    if (!title || !title.trim())
      return res.status(400).json({ message: 'Trip title is required' });
    if (!startDate)
      return res.status(400).json({ message: 'Start date is required' });
    if (!endDate)
      return res.status(400).json({ message: 'End date is required' });
    if (new Date(endDate) < new Date(startDate))
      return res.status(400).json({ message: 'End date must be after start date' });

    const newTrip = new Trip({
      user: req.user.id,
      title: title.trim(),
      description,
      startDate,
      endDate,
      isPublic
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (err) {
    console.error('Create trip error:', err);
    res.status(500).json({ message: err.message || 'Failed to create trip' });
  }
});

module.exports = router;
