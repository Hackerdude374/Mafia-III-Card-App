const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
require('dotenv').config();

// Create card
router.post('/', auth, async (req, res) => {
  const { title, description, location, image } = req.body;
  try {
    const newCard = await pool.query(
      'INSERT INTO cards (title, description, location, image, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, location, image, req.user.user_id]
    );
    res.json(newCard.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Read all cards
router.get('/', async (req, res) => {
  try {
    const cards = await pool.query('SELECT * FROM cards');
    res.json(cards.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Update card
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, description, location, image } = req.body;
  try {
    // Check if the card belongs to the user
    const card = await pool.query('SELECT * FROM cards WHERE id = $1 AND user_id = $2', [id, req.user.user_id]);
    if (card.rows.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to edit this card' });
    }
    const updatedCard = await pool.query(
      'UPDATE cards SET title = $1, description = $2, location = $3, image = $4 WHERE id = $5 RETURNING *',
      [title, description, location, image, id]
    );
    res.json(updatedCard.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Delete card
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the card belongs to the user
    const card = await pool.query('SELECT * FROM cards WHERE id = $1 AND user_id = $2', [id, req.user.user_id]);
    if (card.rows.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to delete this card' });
    }
    await pool.query('DELETE FROM cards WHERE id = $1', [id]);
    res.json({ message: 'Card deleted' });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
