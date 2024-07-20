const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
require('dotenv').config();

// User registration
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    const token = jwt.sign(
      { user_id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Token generated:', token); // Debugging
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    if (err.code === 'P2002') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).send('Server error');
  }
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { user_id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Token generated:', token); // Debugging
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;