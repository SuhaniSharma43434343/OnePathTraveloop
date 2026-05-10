const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

// Absolute path so it works regardless of cwd
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `reg-${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(Object.assign(new Error('Only image files are allowed'), { status: 400 }));
    }
    cb(null, true);
  }
});

// Register — wrap multer in a promise so we can catch its errors inside try/catch
function runUpload(req, res) {
  return new Promise((resolve, reject) => {
    upload.single('avatar')(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Register
router.post('/register', async (req, res) => {
  try {
    await runUpload(req, res);

    const { name, email, password, role } = req.body;

    // Field validation
    if (!name || !name.trim())
      return res.status(400).json({ message: 'Full name is required' });
    if (!email || !email.trim())
      return res.status(400).json({ message: 'Email is required' });
    if (!password)
      return res.status(400).json({ message: 'Password is required' });
    if (password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: 'Enter a valid email address' });

    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: 'An account with this email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const avatarUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashed,
      role: role || 'traveler',
      avatar: avatarUrl
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });

  } catch (err) {
    console.error('Register error:', err);
    const status = err.status || err.statusCode || 500;
    const message = status < 500 ? err.message : 'Server error. Please try again.';
    return res.status(status).json({ message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(400).json({ message: 'No account found with this email' });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
