const express = require('express');
const router = express.Router();
const ChecklistItem = require('../models/ChecklistItem');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Checklists
router.get('/:tripId/checklist', auth, async (req, res) => {
  try {
    const items = await ChecklistItem.find({ trip: req.params.tripId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:tripId/checklist', auth, async (req, res) => {
  try {
    const newItem = new ChecklistItem({ ...req.body, trip: req.params.tripId });
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/checklist/:id', auth, async (req, res) => {
  try {
    const updated = await ChecklistItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/checklist/:id', auth, async (req, res) => {
  try {
    await ChecklistItem.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Notes
router.get('/:tripId/notes', auth, async (req, res) => {
  try {
    const notes = await Note.find({ trip: req.params.tripId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:tripId/notes', auth, async (req, res) => {
  try {
    const newNote = new Note({ ...req.body, trip: req.params.tripId });
    const saved = await newNote.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/notes/:id', auth, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
