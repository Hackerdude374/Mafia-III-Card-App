const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/:cardId', auth, async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user.user_id;
    console.log('User ID:', userId, 'Card ID:', cardId); // Debugging

    const newFavorite = await pool.query(
      'INSERT INTO favorites (user_id, card_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [userId, cardId]
    );

    if (newFavorite.rows.length === 0) {
      return res.status(400).json({ message: 'Card already favorited' });
    }

    res.json(newFavorite.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.user_id;
    console.log('Fetching favorites for User ID:', userId); // Debugging

    const favorites = await pool.query(
      'SELECT cards.* FROM cards INNER JOIN favorites ON cards.id = favorites.card_id WHERE favorites.user_id = $1',
      [userId]
    );

    res.json(favorites.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
