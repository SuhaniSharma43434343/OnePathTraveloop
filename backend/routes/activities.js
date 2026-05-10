const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Get all activities for a stop
router.get('/stop/:stopId', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ stop: req.params.stopId }).sort({ startTime: 1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add an activity
router.post('/', auth, async (req, res) => {
  try {
    const newActivity = new Activity(req.body);
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
