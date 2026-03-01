const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Message = require('../models/Message');

const router = express.Router();

// Send a message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { to, content } = req.body;
    if (!to || !content) return res.status(400).json({ message: 'Recipient and content required' });
    const from = req.user.id;
    const message = new Message({ from, to, content });
    await message.save();
    const populated = await message.populate('from to', 'name role email');
    res.status(201).json({ message: 'Message sent', data: populated });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all messages for the current user (with sender/receiver names)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message
      .find({ $or: [{ from: userId }, { to: userId }] })
      .populate('from to', 'name role email')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get conversation between current user and another user
router.get('/conversation/:userId', authMiddleware, async (req, res) => {
  try {
    const myId = req.user.id;
    const otherId = req.params.userId;
    const messages = await Message
      .find({
        $or: [
          { from: myId, to: otherId },
          { from: otherId, to: myId }
        ]
      })
      .populate('from to', 'name role email')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark message as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(id, { read: true }, { new: true });
    res.json({ message: 'Marked as read', data: message });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
