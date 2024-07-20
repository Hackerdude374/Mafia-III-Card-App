const express = require('express');
const prisma = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/:cardId', auth, async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user.user_id;
    console.log('User ID:', userId, 'Card ID:', cardId);

    const newFavorite = await prisma.favorite.create({
      data: {
        user_id: userId,
        card_id: parseInt(cardId)
      }
    });

    res.json(newFavorite);
  } catch (err) {
    console.error(err.message);
    if (err.code === 'P2002') {
      return res.status(400).json({ message: 'Card already favorited' });
    }
    res.status(500).send('Server error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.user_id;
    console.log('Fetching favorites for User ID:', userId);

    const favorites = await prisma.favorite.findMany({
      where: { user_id: userId },
      include: { card: true }
    });

    res.json(favorites.map(fav => fav.card));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.delete('/:cardId', auth, async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user.user_id;
    console.log('User ID:', userId, 'Card ID:', cardId);

    const deleteFavorite = await prisma.favorite.delete({
      where: {
        user_id_card_id: {
          user_id: userId,
          card_id: parseInt(cardId)
        }
      }
    });

    res.json(deleteFavorite);
  } catch (err) {
    console.error(err.message);
    if (err.code === 'P2025') {
      return res.status(400).json({ message: 'Favorite not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;