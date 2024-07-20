const express = require('express');
const router = express.Router();
const prisma = require('../db');
const auth = require('../middleware/auth');

// Create card
router.post('/', auth, async (req, res) => {
  const { title, description, location, image } = req.body;
  try {
    const newCard = await prisma.card.create({
      data: {
        title,
        description,
        location,
        image,
        user_id: req.user.user_id
      }
    });
    res.json(newCard);
  } catch (err) {
    console.error('Error creating card:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Read all cards
router.get('/', async (req, res) => {
  try {
    const cards = await prisma.card.findMany();
    res.json(cards);
  } catch (err) {
    console.error('Error fetching cards:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch cards created by the authenticated user
router.get('/user', auth, async (req, res) => {
  try {
    console.log('Fetching user cards for user ID:', req.user.user_id);
    const userCards = await prisma.card.findMany({
      where: { user_id: req.user.user_id }
    });
    res.json(userCards);
  } catch (err) {
    console.error('Error fetching user cards:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update card
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, description, location, image } = req.body;
  try {
    const card = await prisma.card.findFirst({
      where: {
        id: parseInt(id),
        user_id: req.user.user_id
      }
    });
    if (!card) {
      return res.status(403).json({ message: 'You do not have permission to edit this card' });
    }
    const updatedCard = await prisma.card.update({
      where: { id: parseInt(id) },
      data: { title, description, location, image }
    });
    res.json(updatedCard);
  } catch (err) {
    console.error('Error updating card:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete card
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const card = await prisma.card.findFirst({
      where: {
        id: parseInt(id),
        user_id: req.user.user_id
      }
    });
    if (!card) {
      return res.status(403).json({ message: 'You do not have permission to delete this card' });
    }
    await prisma.card.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Card deleted' });
  } catch (err) {
    console.error('Error deleting card:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin delete card
router.delete('/admin/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.favorite.deleteMany({ where: { card_id: parseInt(id) } });
    await prisma.likeDislike.deleteMany({ where: { card_id: parseInt(id) } });
    await prisma.card.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Card and related data deleted' });
  } catch (err) {
    console.error('Error deleting card:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment like count
router.post('/:id/like', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const card = await prisma.card.findUnique({ where: { id: parseInt(id) } });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const likedBy = card.liked_by || [];
    const dislikedBy = card.disliked_by || [];

    if (likedBy.includes(userId)) {
      return res.status(400).json({ message: 'Card already liked' });
    }

    const updatedCard = await prisma.card.update({
      where: { id: parseInt(id) },
      data: {
        likes: { increment: 1 },
        liked_by: { push: userId },
        disliked_by: dislikedBy.filter(id => id !== userId)
      }
    });

    res.json(updatedCard);
  } catch (err) {
    console.error('Error liking card:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment dislike count
router.post('/:id/dislike', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const card = await prisma.card.findUnique({ where: { id: parseInt(id) } });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const likedBy = card.liked_by || [];
    const dislikedBy = card.disliked_by || [];

    if (dislikedBy.includes(userId)) {
      return res.status(400).json({ message: 'Card already disliked' });
    }

    const updatedCard = await prisma.card.update({
      where: { id: parseInt(id) },
      data: {
        dislikes: { increment: 1 },
        disliked_by: { push: userId },
        liked_by: likedBy.filter(id => id !== userId)
      }
    });

    res.json(updatedCard);
  } catch (err) {
    console.error('Error disliking card:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unlike card
router.delete('/:id/unlike', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const card = await prisma.card.findUnique({ where: { id: parseInt(id) } });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const likedBy = card.liked_by || [];

    if (!likedBy.includes(userId)) {
      return res.status(400).json({ message: 'Card not liked yet' });
    }

    const updatedCard = await prisma.card.update({
      where: { id: parseInt(id) },
      data: {
        likes: { decrement: 1 },
        liked_by: likedBy.filter(id => id !== userId)
      }
    });

    res.json(updatedCard);
  } catch (err) {
    console.error('Error unliking card:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Undislike card
router.delete('/:id/undislike', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const card = await prisma.card.findUnique({ where: { id: parseInt(id) } });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const dislikedBy = card.disliked_by || [];

    if (!dislikedBy.includes(userId)) {
      return res.status(400).json({ message: 'Card not disliked yet' });
    }

    const updatedCard = await prisma.card.update({
      where: { id: parseInt(id) },
      data: {
        dislikes: { decrement: 1 },
        disliked_by: dislikedBy.filter(id => id !== userId)
      }
    });

    res.json(updatedCard);
  } catch (err) {
    console.error('Error undisliking card:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch card by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const card = await prisma.card.findUnique({ where: { id: parseInt(id) } });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(card);
  } catch (err) {
    console.error('Error fetching card by ID:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;